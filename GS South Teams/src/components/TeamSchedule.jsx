import { useEffect, useState } from 'react';
import { supabase } from '../Utils/supabaseClient';
import ShiftDetailsModal from './ShiftDetailsModal'; 
import '../css/TeamSchedule.css'; 

export default function TeamSchedule({ subgroupIds = [], assignedScheduleIds = null, isGroupView = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null); 

  const groupParams = subgroupIds.join(',');
  const syncUrl = `webcal://your-project-id.supabase.co/functions/v1/calendar-feed?subgroups=${groupParams}`;

  useEffect(() => {
    const getAllSchedules = async () => {
      if (!subgroupIds || subgroupIds.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // If we are filtering for personal assignments, but the user has no assigned shifts, exit early
      if (assignedScheduleIds !== null && assignedScheduleIds.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // 🚀 Start forming our base query
      let query = supabase
        .from('schedules') 
        .select(`*, subgroups ( name )`)
        .in('subgroup_id', subgroupIds);

      // 🔧 THE CONDITIONAL SWITCH: 
      // If assignedScheduleIds is present, restrict the results ONLY to those specific assigned shifts.
      if (assignedScheduleIds !== null) {
        query = query.in('id', assignedScheduleIds);
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    getAllSchedules();
  }, [JSON.stringify(subgroupIds), JSON.stringify(assignedScheduleIds)]); 

  if (loading) return <p className="schedule-loading">Loading schedule stream...</p>;

  return (
    <div className="schedule-container">
      <h3 className="schedule-title">
        {isGroupView ? "📅 Complete Team Rota Calendar" : "📅 Your Personal Shift Schedule"}
      </h3>

      {!isGroupView && subgroupIds.length > 0 && (
        <div className="sync-card">
          <div className="sync-text-group">
            <h4 className="sync-title">Sync All My Teams</h4>
            <p className="sync-description">Subscribe once to sync rotas for all your teams directly to your phone calendar.</p>
          </div>
          <a href={syncUrl} className="sync-button">Subscribe</a>
        </div>
      )}

      {events.length === 0 ? (
        <p className="schedule-empty">
          {isGroupView 
            ? "No upcoming events scheduled for this team." 
            : "You aren't personally scheduled to serve on any upcoming shifts yet."}
        </p>
      ) : (
        <div className="schedule-grid">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="event-card" 
              onClick={() => setSelectedEventId(event.id)} 
              style={{ cursor: 'pointer' }}
            >
              <span className="team-badge">{event.subgroups?.name || 'General'}</span>
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

      {selectedEventId && (
        <ShiftDetailsModal 
          eventId={selectedEventId} 
          onClose={() => setSelectedEventId(null)} 
        />
      )}
    </div>
  );
}
