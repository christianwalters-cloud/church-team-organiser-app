import { Icon } from "../Utils/Icon";

function FormInput({ type, placeholder, value, onChange, iconName, children }) {
  return (
    <div className='input'>
      <Icon name={iconName} className="nav-menu-icon" />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        required
      />
      {/* 💡 This slot renders your toggle show/hide button if passed through! */}
      {children}
    </div>
  );
}

export default FormInput;
