import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Icon } from "../Utils/Icon"; 
import NavItem from "./NavItem"; // 1. IMPORT YOUR NEW REUSABLE LINK COMPONENT
import '../css/Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  
  const privateNavItems = [
    { path: "/join-team", label: "Join a Team", iconName: "joinTeamImage" },
    { path: "/schedule", label: "Your Schedule", iconName: "scheduleImage" },
    { path: "/chats", label: "Your Chats", iconName: "chatsImage" },
  ];

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-container">
        
        {/* 1. Brand Logo */}
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
            /* Renders reusable auth item layout component */
            <NavItem 
              path="/login-and-sign-up"
              label="Login/Sign Up"
              iconName="loginImage"
              className="nav-link auth-link"
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
