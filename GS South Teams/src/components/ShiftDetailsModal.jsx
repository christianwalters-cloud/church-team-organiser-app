import { useEffect, useState } from 'react';
import { supabase } from '../Utils/supabaseClient';
import '../css/TeamSchedule.css'; // Reuses schedule styles or custom card overlays

export default function ShiftDetailsModal({ eventId, onClose }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!eventId) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('schedule_assignments')
        .select(`
          id,
          role_name,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('schedule_id', eventId);

      if (error) {
        console.error('Error fetching shift rota:', error);
      } else {
        setRoster(data || []);
      }
      setLoading(false);
    };

    fetchRoster();
  }, [eventId]);

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '450px' }}>
        <h3>👥 Who is serving with you?</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Team members assigned to this rotation block.</p>

        {loading ? (
          <p>Loading team rota...</p>
        ) : roster.length === 0 ? (
          <p className="schedule-empty">No team members assigned to this shift yet.</p>
        ) : (
          <div className="roster-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roster.map((member) => (
              <div 
                key={member.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px', 
                  background: '#f8fafc', 
                  borderRadius: '8px' 
                }}
              >
                <img 
                  src={member.profiles?.avatar_url || 'https://dicebear.com'} 
                  alt="" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <strong style={{ color: '#1e293b' }}>{member.profiles?.full_name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '500' }}>{member.role_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          type="button" 
          className="modal-cancel-btn" 
          onClick={onClose} 
          style={{ marginTop: '1.5rem', width: '100%' }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
}
