import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { Route, Routes, Navigate } from 'react-router-dom'

//placeholder stuff
const HomeDashboard = () => <div><h2>Your Dashboard</h2><p>Welcome to your personal area.</p></div>;
const JoinTeam = () => <div><h2>Join a Team</h2><p>Find your group matches here.</p></div>;
const Schedule = () => <div><h2>Your Schedule</h2><p>Check upcoming event dates.</p></div>;
const Chats = () => <div><h2>Your Chats</h2><p>Your team messaging history.</p></div>;
const Settings = () => <div><h2>Settings Configuration</h2><p>Adjust user preferences.</p></div>;


function App() {
  // Added a state variable to control whether the logged-in views show up
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      {/* Displaying your new GS South Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />
      
      <main style={{ padding: '2rem' }}>
        {isLoggedIn && (
        <div className="status-bar">
        <span className="status-text">Status: Logged into GS South</span>
        <button className="btn-logout" onClick={() => setIsLoggedIn(false)}>Log Out</button>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/dashboard"/> :(
            <div className='feature pannel'>
              <h2>Welcome to gs south laning page</h2>
            <p>Please log in or sign up to access your dashboard features.</p>
            </div>
          )
        } />
 {/* Authentication Pages */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/sign-up" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />

          {/* Protected Dashboard Views */}
          <Route path="/dashboard" element={isLoggedIn ? <HomeDashboard /> : <Navigate to="/login" />} />
          <Route path="/join-team" element={isLoggedIn ? <JoinTeam /> : <Navigate to="/login" />} />
          <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login" />} />
          <Route path="/chats" element={isLoggedIn ? <Chats /> : <Navigate to="/login" />} />
          
          {/* Settings Configuration Screen */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Wildcard Route: Catches invalid paths and safely routes users home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </main>
    </>
  )
}

export default App
