import { Icon } from "../Utils/Icon";

// 🔧 Added ...rest parameter to gather and pass through all standard HTML attributes
function FormInput({ type, placeholder, value, onChange, iconName, children, ...rest }) {
  return (
    <div className='input'>
      <Icon name={iconName} className="nav-menu-icon" />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        {...rest} // 🚀 Spreads required, maxLength, disabled, etc. dynamically onto the element
      />
      {/* This slot renders your toggle show/hide button if passed through! */}
      {children}
    </div>
  );
}

export default FormInput;

