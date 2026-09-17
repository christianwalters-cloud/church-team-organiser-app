import { Link } from "react-router-dom";
import { Icon } from "../Utils/Icon";
import '../css/Navbar.css'

function NavItem({ path, label, iconName, className = "", onClick }) {
  return (
    <li>
      <Link 
        to={path} 
        // 🔧 Combines the mandatory base styles with any conditional variant overrides (e.g. auth-link)
        className={`nav-link ${className}`.trim()} 
        onClick={onClick}
        aria-label={label}
      >
        <div aria-hidden="true" className="nav-link-visual-content">
          <Icon name={iconName} className="nav-menu-icon" />
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
}

export default NavItem;

