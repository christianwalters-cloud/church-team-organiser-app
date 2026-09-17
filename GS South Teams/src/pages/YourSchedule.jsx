import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient'; 
import TeamSchedule from '../components/TeamSchedule';
import '../css/YourSchedule.css';

function YourSchedule() { 
  const { subgroupId } = useParams(); 
  const [myTeamIds, setMyTeamIds] = useState([]);
  const [assignedScheduleIds, setAssignedScheduleIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const fetchScheduleContext = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      if (subgroupId) {
        // 🗓️ VIEW A: Full Group Calendar (From Dashboard "View Rota")
        setMyTeamIds([subgroupId]);
        setAssignedScheduleIds(null); // Passing null bypasses the personal shift filter

        // Fetch the group name to make the header clear
        const { data: groupData } = await supabase
          .from('subgroups')
          .select('name')
          .eq('id', subgroupId)
          .single();
        
        if (groupData) setGroupName(groupData.name);
      } else {
        // 🗓️ VIEW B: Master Personal Schedule (From Navbar "Your Schedule")
        // Step 1: Fetch user's team memberships to feed the subscription feed utility
        const { data: memberData } = await supabase
          .from('team_members')
          .select('subgroup_id')
          .eq('user_id', user.id);

        if (memberData) {
          setMyTeamIds(memberData.map(item => item.subgroup_id));
        }

        // Step 2: Query assignments to isolate ONLY rows where the user is serving
        const { data: assignmentData } = await supabase
          .from('schedule_assignments')
          .select('schedule_id')
          .eq('user_id', user.id);

        if (assignmentData) {
          setAssignedScheduleIds(assignmentData.map(item => item.schedule_id));
        }
      }
      setLoading(false);
    };

    fetchScheduleContext();
  }, [subgroupId]);

  if (loading) {
    return (
      <div className="schedule-page-container">
        <p className="schedule-context-loading">Verifying calendar access...</p>
      </div>
    );
  }

  return (
    <div className="schedule-page-container">
      <div className="schedule-page-header">
        <div className="header-titles">
          <h2>{subgroupId ? `${groupName} Rota` : "Your Personalized Schedule"}</h2>
          <p>
            {subgroupId 
              ? "Displaying all scheduled shifts and service blocks for this team." 
              : "Displaying upcoming events where you are personally assigned to serve."}
          </p>
        </div>
        {subgroupId && (
          <Link to="/dashboard" className="back-dashboard-btn">
            &larr; Back to Dashboard
          </Link>
        )}
      </div>
      
      <TeamSchedule 
        subgroupIds={myTeamIds} 
        assignedScheduleIds={assignedScheduleIds} 
        isGroupView={!!subgroupId}
      />
    </div>
  );
}

export default YourSchedule;
