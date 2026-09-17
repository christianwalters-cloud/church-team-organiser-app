import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../Utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../css/YourChats.css';

export default function YourChats() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef(null);

  // Helper function to extract user initials for the avatar badge
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n).join('').substring(0, 2).toUpperCase();
  };

  // Helper function to format message timestamps cleanly
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Phase 1: Fetch all chat rooms linked to subgroups this user belongs to (FIXED SPLIT QUERY)
  useEffect(() => {
    if (!user) return;

    const fetchMyTeamChats = async () => {
      // Step A: Fetch only the subgroup IDs for this user (Bypasses HTTP 400 nested join error)
      const { data: memberRows, error: memberError } = await supabase
        .from('team_members')
        .select('subgroup_id')
        .eq('user_id', user.id);

      if (memberError) {
        console.error("Error loading team memberships:", memberError);
        return;
      }

      if (!memberRows || memberRows.length === 0) {
        setChatRooms([]);
        setSelectedRoom(null);
        return;
      }

      // Extract the subgroup IDs into a flat array: ['uuid1', 'uuid2']
      const subgroupIds = memberRows.map(row => row.subgroup_id);

      // Step B: Query the chat_rooms table directly using an '.in()' filter, joining the subgroup name
      const { data: roomRows, error: roomError } = await supabase
        .from('chat_rooms')
        .select(`
          id,
          subgroups (
            name
          )
        `)
        .in('subgroup_id', subgroupIds);

      if (roomError) {
        console.error("Error loading chat rooms:", roomError);
        return;
      }

      if (roomRows) {
        // Flatten the data cleanly into your channel sidebar state structure
        const rooms = roomRows.map(room => ({
          id: room.id,
          name: room.subgroups?.name || 'Unknown Team'
        }));

        setChatRooms(rooms);
        
        // Auto-select the first channel if none is currently active
        if (rooms.length > 0) {
          const stillExists = rooms.some(r => r.id === selectedRoom?.id);
          if (!selectedRoom || !stillExists) {
            setSelectedRoom(rooms[0]);
          }
        } else {
          setSelectedRoom(null);
        }
      }
    };

    fetchMyTeamChats();
    
    // Live Membership Trigger: Reload layout immediately if user joins or leaves teams dynamically
    const membershipChannel = supabase
      .channel('my-memberships')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members', filter: `user_id=eq.${user.id}` },
        () => { fetchMyTeamChats(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membershipChannel);
    };
  }, [user, selectedRoom?.id]);

  // Phase 2: Load messages history and attach live real-time listeners on room selection changes
  useEffect(() => {
    if (!selectedRoom?.id) {
      setMessages([]);
      return;
    }

    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id, message_text, created_at, sender_id,
          profiles ( full_name, avatar_url )
        `)
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchChatHistory();

    const chatChannel = supabase
      .channel(`room-${selectedRoom.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${selectedRoom.id}` },
        async (payload) => {
          if (payload.new.sender_id === user.id) return;

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const fullIncomingMessage = {
            ...payload.new,
            profiles: profile
          };

          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, fullIncomingMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [selectedRoom?.id, user.id]);

  // Phase 3: Auto-scroll window focusing adjustments
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Phase 4: Submit a message packet using optimistic UI scaling
  const sendTextMessage = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || !selectedRoom?.id) return;

    const temporaryId = crypto.randomUUID();
    const sentText = textInput;
    setTextInput('');

    const currentUserName = messages.find(m => m.sender_id === user.id)?.profiles?.full_name || "You";

    const optimisticMessage = {
      id: temporaryId,
      room_id: selectedRoom.id,
      sender_id: user.id,
      message_text: sentText,
      created_at: new Date().toISOString(),
      profiles: { full_name: currentUserName, avatar_url: null }
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        { room_id: selectedRoom.id, sender_id: user.id, message_text: sentText }
      ])
      .select(`
        id, message_text, created_at, sender_id,
        profiles ( full_name, avatar_url )
      `)
      .single();

    if (error) {
      console.error("Failed to deliver message:", error);
      setMessages((prev) => prev.filter(m => m.id !== temporaryId));
    } else if (data) {
      setMessages((prev) => prev.map(m => m.id === temporaryId ? data : m));
    }
  };

  return (
    <div className="chats-wrapper">
      
      {/* Sidebar Layout */}
      <div className="chats-sidebar">
        <h3>Your Channels</h3>
        <ul className="channels-list">
          {chatRooms.map(room => (
            <li 
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`channel-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
            >
              # {room.name}
            </li>
          ))}
          {chatRooms.length === 0 && (
            <p className="no-channels-msg">
              You haven't joined any groups yet. Join a team from the dashboard to start chatting!
            </p>
          )}
        </ul>
      </div>

      {/* Main Messaging Window */}
      <div className="chat-main-window">
        {selectedRoom ? (
          <>
            <div className="chat-header">
              <h4># {selectedRoom.name}</h4>
            </div>
            
            <div className="messages-stream-box">
              {messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                const senderName = msg.profiles?.full_name || "Active Member";
                
                return (
                  <div key={msg.id} className={`message-container ${isMe ? 'sent' : 'received'}`}>
                    <div className="message-avatar">
                      {getInitials(senderName)}
                    </div>

                    <div className="message-details">
                      <div className="message-meta">
                        <span className="message-sender-name">{isMe ? "You" : senderName}</span>
                        <span className="message-timestamp">{formatTime(msg.created_at)}</span>
                      </div>
                      <div className="message-bubble">
                        {msg.message_text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <form onSubmit={sendTextMessage} className="chat-input-form">
                <input 
                  type="text" 
                  value={textInput} 
                  onChange={(e) => setTextInput(e.target.value)} 
                  placeholder={`Message #${selectedRoom.name}`}
                  className="chat-text-input"
                />
                <button type="submit" className="chat-send-btn">Send</button>
              </form>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a team channel from the sidebar to start communicating</p>
          </div>
        )}
      </div>
    </div>
  );
}
