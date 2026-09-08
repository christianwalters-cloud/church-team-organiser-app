import { useEffect, useState } from 'react';
import { supabase } from '../Utils/supabaseClient';
import '../css/TeamSchedule.css'; 

// 💡 Changed prop from "subgroupId" to an array: "subgroupIds"
export default function TeamSchedule({ subgroupIds = [] }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generates a multi-team subscription link for their phone feed
  const groupParams = subgroupIds.join(',');
  const syncUrl = `webcal://your-project-id.supabase.co/functions/v1/calendar-feed?subgroups=${groupParams}`;

  useEffect(() => {
    const getAllSchedules = async () => {
      if (subgroupIds.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('schedules') 
        .select(`
          *,
          subgroups ( name )
        `) // 🚀 Joins subgroup table to show WHICH team the event is for!
        .in('subgroup_id', subgroupIds)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    getAllSchedules();
  }, [subgroupIds]);

  if (loading) return <p className="schedule-loading">Loading your personalized schedule...</p>;

  return (
    <div className="schedule-container">
      <h3 className="schedule-title">📅 Your Personal Schedule</h3>

      <div className="sync-card">
        <div className="sync-text-group">
          <h4 className="sync-title">Sync All My Teams</h4>
          <p className="sync-description">
            Subscribe once to sync rotas for all your teams directly to your phone calendar.
          </p>
        </div>
        <a href={syncUrl} className="sync-button">Subscribe</a>
      </div>

      {events.length === 0 ? (
        <p className="schedule-empty">You don't have any upcoming events scheduled across your teams.</p>
      ) : (
        <div className="schedule-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              {/* 🏷️ Dynamically shows the sub-team badge */}
              <span className="team-badge">{event.subgroups?.name}</span>
              <h4 className="event-title" style={{ marginTop: '0.5rem' }}>{event.title}</h4>
              <p className="event-description">{event.description}</p>
              <div className="event-meta">
                <span className="event-location">📍 {event.location}</span>
                <span className="event-time">
                  ⏰ {new Date(event.start_time).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
