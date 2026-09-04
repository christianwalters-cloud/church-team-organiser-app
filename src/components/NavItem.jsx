import { Link } from "react-router-dom";
import { Icon } from "../Utils/Icon";
import '../css/Navbar.css'

function NavItem({ path, label, iconName, className = "nav-link", onClick }) {
  return (
    <li>
      <Link 
        to={path} 
        className={className} 
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
