
import React from 'react';
import Icon from './Icon';
import { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  isTripActive?: boolean;
  isSosActive?: boolean;
  onGoClick?: () => void;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isSpecial?: boolean;
  disabled?: boolean;
  isSosActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, isSpecial, disabled, isSosActive }) => {
  if (isSpecial) {
    if (disabled) {
       return (
        <button disabled className="w-16 flex flex-col items-center justify-center opacity-30 cursor-not-allowed">
           <div className="bg-gray-200 text-gray-400 p-4 rounded-full border-4 border-white">
             {icon}
           </div>
           <span className="text-[10px] font-medium mt-1 uppercase tracking-wide text-gray-400">{label}</span>
        </button>
       );
    }
    
    // SOS Active State: Flashing Red
    if (isSosActive) {
        return (
          <button
            onClick={onClick}
            className={`relative -top-6 bg-red-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] border-4 border-white transform transition-all active:scale-95 animate-pulse`}
            aria-label="SOS Active"
          >
            {icon}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </button>
        );
    }

    // Default Gora Theme State: Emerald
    return (
      <button
        onClick={onClick}
        className={`relative -top-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg border-4 border-white transform transition-all active:scale-95 hover:bg-emerald-500`}
        aria-label="Go Activity Button"
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {icon}
      <span className="text-[10px] font-medium mt-1 uppercase tracking-wide">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, isTripActive = false, isSosActive = false, onGoClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-end h-full pb-2">
        <NavItem
          label="Explore"
          isActive={activeScreen === 'Explore'}
          onClick={() => setActiveScreen('Explore')}
          icon={
            <Icon className="w-6 h-6">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </Icon>
          }
        />
        <NavItem
          label="Planner"
          isActive={activeScreen === 'Planner'}
          onClick={() => setActiveScreen('Planner')}
          icon={
             <Icon className="w-6 h-6">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
               <line x1="16" y1="2" x2="16" y2="6" />
               <line x1="8" y1="2" x2="8" y2="6" />
               <line x1="3" y1="10" x2="21" y2="10" />
             </Icon>
          }
        />
        {/* Go / Paw Button */}
        <NavItem
          label="" 
          isActive={false}
          onClick={() => onGoClick && onGoClick()}
          isSpecial
          isSosActive={isSosActive}
          disabled={false}
          icon={
            <Icon className="w-7 h-7">
               <path d="M12 11c-1.3 0-2.4.8-2.8 2-.9-1.1-2.4-1.6-3.7-1.1-1.3.4-2.1 1.7-1.9 3 .3 1.7 2.4 2.8 3.9 3.1 2.3.5 4.5.5 6.8 0 1.5-.3 3.6-1.4 3.9-3.1.2-1.3-.6-2.6-1.9-3-1.3-.5-2.8 0-3.7 1.1-.4-1.2-1.5-2-2.8-2z" />
               <path d="M12 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
               <path d="M6 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
               <path d="M18 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
               <path d="M9 5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </Icon>
          }
        />
        <NavItem
          label="Connect"
          isActive={activeScreen === 'Connect'}
          onClick={() => setActiveScreen('Connect')}
          icon={
            <Icon className="w-6 h-6">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </Icon>
          }
        />
        <NavItem
          label="Profile"
          isActive={activeScreen === 'Profile'}
          onClick={() => setActiveScreen('Profile')}
          icon={
            <Icon className="w-6 h-6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </Icon>
          }
        />
      </div>
    </div>
  );
};

export default BottomNav;
