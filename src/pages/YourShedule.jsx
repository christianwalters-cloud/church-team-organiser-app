import { useEffect, useState } from 'react';
import { supabase } from '../Utils/supabaseClient'; // 🚀 Assumes client is in /src root directory
import TeamSchedule from '../components/TeamShedule'; // 🚀 Steps out of pages/ to grab from components/

function YourSchedule() { 
  const [myTeamIds, setMyTeamIds] = useState([]);

  useEffect(() => {
    const fetchUserMemberships = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetches group associations mapping the user to their subgroups
      const { data, error } = await supabase
        .from('team_members')
        .select('subgroup_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching memberships:', error);
      } else if (data) {
        setMyTeamIds(data.map(item => item.subgroup_id));
      }
    };

    fetchUserMemberships();
  }, []);

  return (
    <div className="app-page">
      <h2>Welcome to GS South</h2>
      
      {/* Pass the array of user team IDs straight in */}
      <TeamSchedule subgroupIds={myTeamIds} />
    </div>
  );
}

export default YourSchedule;
