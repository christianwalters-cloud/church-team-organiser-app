import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'
import Navbar from './components/Navbar'
import LoginAndSignUp from './pages/LoginAndSignUp'
import ResetPasswordModal from './components/ResetPasswordModal' // 1. IMPORT MODAL

// Placeholder components
const HomeDashboard = () => <div className="feature-panel"><h2>Your Dashboard</h2><p>Welcome to your personal area.</p></div>;
const JoinTeam = () => <div className="feature-panel"><h2>Join a Team</h2><p>Find your group matches here.</p></div>;
const Schedule = () => <div className="feature-panel"><h2>Your Schedule</h2><p>Check upcoming event dates.</p></div>;
const Chats = () => <div className="feature-panel"><h2>Your Chats</h2><p>Your team messaging history.</p></div>;
const Settings = () => <div className="feature-panel"><h2>Settings Configuration</h2><p>Adjust user preferences.</p></div>;

function App() {
  const { isLoggedIn, logout } = useAuth(); // Notice how all the extra modal state noise is gone!

  return (
    <>
      <Navbar />
      
      <main>
        {isLoggedIn && (
          <div className="status-bar">
            <span className="status-text">Status: Logged into GS South</span>
            <button className="btn-logout" onClick={logout}>Log Out</button>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" /> : (
              <div className="feature-panel">
                <h2>Welcome to the GS South Landing Page</h2>
                <p>Please log in or sign up to access your dashboard features.</p>
              </div>
            )
          } />

          <Route path="/login-and-sign-up" element={<LoginAndSignUp />} />

          {/* Protected Dashboard Views */}
          <Route path="/dashboard" element={isLoggedIn ? <HomeDashboard /> : <Navigate to="/login-and-sign-up" />} />
          <Route path="/join-team" element={isLoggedIn ? <JoinTeam /> : <Navigate to="/login-and-sign-up" />} />
          <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login-and-sign-up" />} />
          <Route path="/chats" element={isLoggedIn ? <Chats /> : <Navigate to="/login-and-sign-up" />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* 2. MOUNT THE SEPARATED POPUP COMPONENT OVERLAY */}
      <ResetPasswordModal />
    </>
  )
}

export default App;
