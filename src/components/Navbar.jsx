import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../Utils/Icon"; 
import '../css/Navbar.css'

function Navbar({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const privateNavItems = [
    { path: "/join-team", label: "Join a Team", iconName: "joinTeamImage" },
    { path: "/schedule", label: "Your Schedule", iconName: "scheduleImage" },
    { path: "/chats", label: "Your Chats", iconName: "chatsImage" },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* ADDED CONTAINER: This keeps everything fitting nicely inside the screen */}
      <div className="navbar-container">
        
        {/* 1. Brand Logo */}
        <div className="navbar-logo">
          <Link 
            to="/" 
            className="nav-link logo-link" 
            onClick={() => setIsOpen(false)}
            aria-label="GS South Home"
          >
            <div aria-hidden="true" className="nav-link-visual-content">
              <Icon name="homeImage" className="nav-menu-icon" />
              <span>GS South</span>
            </div>
          </Link>
        </div>

        {/* 2. Mobile Responsive Toggle Button */}
        <button 
          type="button" 
          className={`navbar-toggle-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          <span className="hamburger-line" aria-hidden="true"></span>
          <span className="hamburger-line" aria-hidden="true"></span>
          <span className="hamburger-line" aria-hidden="true"></span>
        </button>
        
        {/* 3. Dynamic Navigation Menus */}
        <ul className={`navbar-menu ${isOpen ? "mobile-open" : ""}`}>
          {isLoggedIn ? (
            <>
              {privateNavItems.map(({ path, label, iconName }) => (
                <li key={path}>
                  <Link 
                    to={path} 
                    className="nav-link" 
                    onClick={() => setIsOpen(false)}
                    aria-label={label}
                  >
                    <div aria-hidden="true" className="nav-link-visual-content">
                      <Icon name={iconName} className="nav-menu-icon" />
                      <span>{label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="nav-link auth-link" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Log into your account"
                >
                  <div aria-hidden="true" className="nav-link-visual-content">
                    <Icon name="loginImage" className="nav-menu-icon" />
                    <span>Login</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link 
                  to="/sign-up" 
                  className="nav-link auth-link" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Create a new account"
                >
                  <div aria-hidden="true" className="nav-link-visual-content">
                    <Icon name="signUpImage" className="nav-menu-icon" />
                    <span>Sign Up</span>
                  </div>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link 
              to="/settings" 
              className="nav-link" 
              onClick={() => setIsOpen(false)}
              aria-label="Settings, Configuration panel"
            >
              <div aria-hidden="true" className="nav-link-visual-content">
                <Icon name="settingsImage" className="nav-menu-icon" />
                <span>Settings</span>
              </div>
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
