import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Icon } from "../Utils/Icon"; 
import NavItem from "./NavItem"; 
import '../css/Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  
  // 🔗 Clean private links list—dropped the duplicate Dashboard item so it doesn't clutter your spacing
  const privateNavItems = [
    { path: "/join-team", label: "Join a Team", iconName: "joinTeamImage" },
    { path: "/schedule", label: "Your Schedule", iconName: "scheduleImage" },
    { path: "/your-chats", label: "Your Chats", iconName: "chatsImage" },
  ];

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-container">
        
        {/* 1. Brand Logo - Links to "/" which triggers the redirect straight to /dashboard via your App.jsx protected views */}
        <div className="navbar-logo">
          <Link 
            to="/" 
            className="nav-link logo-link" 
            onClick={closeMobileMenu}
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
              {/* Maps clean custom items dynamically */}
              {privateNavItems.map(({ path, label, iconName }) => (
                <NavItem 
                  key={path}
                  path={path}
                  label={label}
                  iconName={iconName}
                  onClick={closeMobileMenu}
                />
              ))}
            </>
          ) : (
            /* Renders reusable auth item layout component with explicit class formatting flags */
            <NavItem 
              path="/login-and-sign-up"
              label="Login/Sign Up"
              iconName="loginImage"
              className="auth-link"
              onClick={closeMobileMenu}
            />
          )}

          {/* Settings option shared globally across states */}
          <NavItem 
            path="/settings"
            label="Settings"
            iconName="settingsImage"
            onClick={closeMobileMenu}
          />
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
