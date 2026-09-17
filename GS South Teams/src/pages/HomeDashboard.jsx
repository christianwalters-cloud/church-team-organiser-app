import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import '../css/HomeDashboard.css';

export default function HomeDashboard() {
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMyTeams = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Joins team_members onto subgroups to retrieve the name and details
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        subgroup_id,
        subgroups (
          id,
          name,
          description
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading joined teams:', error);
    } else if (data) {
      // Maps nested relational items flat into state
      setMyTeams(data.map(item => item.subgroups).filter(Boolean));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleLeaveGroup = async (subgroupId, subgroupName) => {
    const confirmLeave = window.confirm(`Are you sure you want to leave the "${subgroupName}" team? This will automatically clear your scheduled shifts for this team.`);
    if (!confirmLeave) return;

    setActionLoadingId(subgroupId);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('user_id', user.id)
      .eq('subgroup_id', subgroupId);

    if (error) {
      alert(`Failed to leave group: ${error.message}`);
    } else {
      // Quietly filter out the item from state locally so the layout adapts immediately
      setMyTeams(prev => prev.filter(team => team.id !== subgroupId));
    }
    setActionLoadingId(null);
  };

  if (loading) return <div className="feature-panel"><p>Loading your dashboard overview...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Dashboard</h2>
        <p>Welcome to your personal area. Below are the GS South teams you actively serve with.</p>
      </div>

      {myTeams.length === 0 ? (
        <div className="feature-panel empty-dashboard-state">
          <p>You haven't joined any sub-teams yet.</p>
          <Link to="/join-team" className="submit link-btn">
            Browse Available Teams
          </Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {myTeams.map((team) => (
            <div key={team.id} className="feature-panel team-dashboard-card">
              <div className="card-header-group">
                <h3>{team.name}</h3>
                <p className="team-card-description">{team.description || 'No description provided.'}</p>
              </div>

              <div className="card-actions-row">
                {/* 🔧 Modified path to pass the specific group id through to the calendar router switch */}
                <Link to={`/schedule/${team.id}`} className="submit view-rota-btn">
                  View Rota
                </Link>
                <button
                  type="button"
                  className="modal-cancel-btn leave-team-btn"
                  disabled={actionLoadingId === team.id}
                  onClick={() => handleLeaveGroup(team.id, team.name)}
                >
                  {actionLoadingId === team.id ? 'Leaving...' : 'Leave Team'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
