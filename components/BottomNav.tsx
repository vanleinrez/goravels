import React from 'react';
import Icon from './Icon';
import { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

interface NavItemProps {
  label: Screen;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isSpecial?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, isSpecial }) => {
  if (isSpecial) {
    return (
      <button
        onClick={onClick}
        className="relative -top-6 bg-red-600 text-white p-4 rounded-full shadow-lg border-4 border-white transform transition-transform active:scale-95 hover:bg-red-700"
        aria-label="SOS Panic Button"
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium mt-1 uppercase tracking-wide">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
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
        <NavItem
          label="SOS"
          isActive={activeScreen === 'SOS'}
          onClick={() => setActiveScreen('SOS')}
          isSpecial
          icon={
            <Icon className="w-7 h-7 font-bold">
               <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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