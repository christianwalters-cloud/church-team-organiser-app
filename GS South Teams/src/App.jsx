import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'
import Navbar from './components/Navbar'
import LoginAndSignUp from './pages/LoginAndSignUp'
import ResetPasswordModal from './components/ResetPasswordModal' 
import JoinATeam from './pages/JoinATeam' 
import YourSchedule from './pages/YourSchedule' 
import HomeDashboard from './pages/HomeDashboard';
import YourChats from './pages/YourChats';


// Cleaned placeholder components block
const Settings = () => <div className="feature-panel"><h2>Settings Configuration</h2><p>Adjust user preferences.</p></div>;

function App() {
  const { isLoggedIn, logout } = useAuth(); 

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
          
          <Route path="/join-team" element={isLoggedIn ? <JoinATeam /> : <Navigate to="/login-and-sign-up" />} />
          
          {/* 🚀 REAL COMPONENT LINKED HERE INSTEAD OF THE PLACEHOLDER */}
         {/* 🔧 Modified schedule routing to support both personal view and deep-linked group calendars */}
         <Route path="/schedule" element={isLoggedIn ? <YourSchedule /> : <Navigate to="/login-and-sign-up" />} />
         <Route path="/schedule/:subgroupId" element={isLoggedIn ? <YourSchedule /> : <Navigate to="/login-and-sign-up" />} />

          
          <Route path="/your-chats" element={isLoggedIn ? <YourChats /> : <Navigate to="/login-and-sign-up" />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <ResetPasswordModal />
    </>
  )
}

export default App;
