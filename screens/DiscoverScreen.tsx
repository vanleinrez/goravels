
import React, { useState } from 'react';
import type { User } from '../types';
import { mockListings, mockSafetyZones } from '../constants';
import ListingCard from '../components/ListingCard';
import Icon from '../components/Icon';
import MapView from '../components/MapView';

interface DiscoverScreenProps {
  user: User;
  onRegister: () => void;
}

type ViewMode = 'list' | 'map';

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ user, onRegister }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAlert, setShowAlert] = useState(true);

  // Helper to intercept actions if user is a guest
  const handleProtectedAction = () => {
    if (user.tier === 'Guest') {
      onRegister();
    } else {
      // Proceed with action (mock for now)
      console.log('Action performed by registered user');
    }
  };

  const ViewToggleButton: React.FC<{
    mode: ViewMode;
    label: string;
    children: React.ReactNode;
  }> = ({ mode, children, label }) => (
    <button
      onClick={() => setViewMode(mode)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
        viewMode === mode
          ? 'bg-emerald-600 text-white shadow-md scale-105'
          : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
      }`}
    >
      {children}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="bg-stone-50 min-h-full pb-20">
      {/* Weather Alert Banner */}
      {showAlert && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 flex justify-between items-start animate-fade-in">
          <div className="flex items-start space-x-2">
            <Icon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </Icon>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Weather Alert</p>
              <p className="text-sm text-amber-900 leading-tight mt-0.5">Heavy rains expected in Bukidnon region. Check geofenced zones.</p>
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-amber-700 hover:text-amber-900">
            <Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-stone-500 text-sm font-medium">Mabuhay,</p>
            <h1 className="text-2xl font-bold text-stone-800">{user.name.split(' ')[0]}!</h1>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 relative overflow-hidden">
             {user.tier === 'Guest' ? (
                 <Icon className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
             ) : (
                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
             )}
          </div>
        </header>
        
        {/* Guest Banner */}
        {user.tier === 'Guest' && (
            <div 
                onClick={onRegister}
                className="bg-stone-800 text-white p-4 rounded-xl shadow-md flex justify-between items-center cursor-pointer"
            >
                <div>
                    <h3 className="font-bold text-sm">Create an account</h3>
                    <p className="text-xs text-stone-400">Sign up to book adventures and collect stamps.</p>
                </div>
                <Icon className="w-5 h-5 text-emerald-400"><polyline points="9 18 15 12 9 6" /></Icon>
            </div>
        )}

        {/* Search Bar */}
        <div className="relative shadow-sm">
          <input
            type="text"
            placeholder="Find your rural escape..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none text-stone-700 placeholder-stone-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <ViewToggleButton mode="list" label="Explore">
            <Icon className="w-4 h-4">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </Icon>
          </ViewToggleButton>
          <ViewToggleButton mode="map" label="Map View">
            <Icon className="w-4 h-4">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            </Icon>
          </ViewToggleButton>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Campaign Banner */}
            <div onClick={handleProtectedAction} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
              <div className="relative z-10">
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">New Campaign</span>
                <h2 className="font-bold text-xl mt-2">The Coffee Trail ☕</h2>
                <p className="text-sm mt-1 mb-4 opacity-90">5-Day Immersion in Bukidnon coffee farms.</p>
                <button className="bg-white text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-stone-100 transition-colors">
                  View Package
                </button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20">
                 <Icon className="w-32 h-32"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></Icon>
              </div>
            </div>

            {/* Adventures */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-stone-800">Trending Adventures</h2>
                <button className="text-xs font-bold text-emerald-600 uppercase tracking-wide">View All</button>
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                {mockListings.filter(l => l.category === 'Adventure').map(listing => (
                  <div key={listing.id} onClick={handleProtectedAction}>
                      <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Experiences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-stone-800">Cultural Moments</h2>
                <button className="text-xs font-bold text-emerald-600 uppercase tracking-wide">View All</button>
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                {mockListings.filter(l => l.category === 'Experience').map(listing => (
                  <div key={listing.id} onClick={handleProtectedAction}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
            <div className="h-[500px] -mx-4 bg-stone-200 relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-red-100">
                <span className="text-xs font-bold text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  Showing Safety Zones
                </span>
              </div>
              <MapView listings={mockListings} safetyZones={mockSafetyZones} />
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
