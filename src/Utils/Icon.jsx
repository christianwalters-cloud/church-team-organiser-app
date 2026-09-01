import HomeIconSvg from '../assets/address-book-solid-full.svg'
import NotificationIconSvg from '../assets/bell-solid-full.svg'
import AlertIconSvg from '../assets/circle-exclamation-solid-full.svg'
import PlusIconSvg from '../assets/circle-plus-solid-full.svg'
import UserIconSvg from '../assets/circle-user-solid-full.svg'
import MessageIconSvg from '../assets/envelope-solid-full.svg'
import FlagIconSvg from '../assets/flag-solid-full.svg'
import SettingsIconSvg from '../assets/gear-solid-full.svg'
import HandshakeIconSvg from '../assets/handshake-solid-full.svg'
import LocationIconSvg from '../assets/location-dot-solid-full.svg'
import MusicIconSvg from '../assets/music-solid-full.svg'
import PaperclipIconSvg from '../assets/paperclip-solid-full.svg'
import BinIconSvg from '../assets/trash-solid-full.svg'
import UsersIconSvg from '../assets/users-solid-full.svg'
import UserPlusIconSvg from '../assets/user-plus-solid-full.svg'

const ICON_REGISTRY = {
  // Navbar Specific Icons
  homeImage: HomeIconSvg,
  joinTeamImage: HandshakeIconSvg,  // Handshake represents joining a team
  scheduleImage: FlagIconSvg,       // Flag or notification can represent events/schedule
  chatsImage: MessageIconSvg,       // Envelope for messaging/chats
  settingsImage: SettingsIconSvg,   // Gear for settings configuration
  loginImage: UserIconSvg,          // User circle icon for logging in
  signUpImage: UserPlusIconSvg,         // Plus icon for registration/signing up
  
  // Extra Utility Icons (Mapped for future use across your app)
  notification: NotificationIconSvg,
  alert: AlertIconSvg,
  location: LocationIconSvg,
  music: MusicIconSvg,
  attachment: PaperclipIconSvg,
  delete: BinIconSvg,
  teamMembers: UsersIconSvg,
};

export function Icon({ name, className = '', ...props }) {
  const iconSrc = ICON_REGISTRY[name]; 

  if (!iconSrc) {
    console.warn(`Icon "${name}" does not exist in your assets registry.`);
    return null;
  }

  return (
    <img 
      src={iconSrc}                      
      alt="" // Explicitly empty tells screen readers this icon is decorative
      className={`nav-icon ${className}`} 
      {...props} 
    />
  );
}
