
import React, { useState } from 'react';
import type { User, ListingCategory } from '../types';
import { mockListings, mockSafetyZones } from '../constants';
import ListingCard from '../components/ListingCard';
import Icon from '../components/Icon';
import MapView from '../components/MapView';

interface DiscoverScreenProps {
  user: User;
  onRegister: () => void;
}

type ViewMode = 'list' | 'map';

const CATEGORIES: { id: ListingCategory | 'All'; label: string; icon: string }[] = [
    { id: 'All', label: 'All', icon: '🌍' },
    { id: 'Adventures', label: 'Adventures', icon: '🧗' },
    { id: 'Experientials', label: 'Experientials', icon: '🎨' },
    { id: 'Immersions', label: 'Immersions', icon: '🛖' },
    { id: 'Stays', label: 'Stays', icon: '🏠' },
    { id: 'Riders', label: 'Riders', icon: '🏍️' },
    { id: 'Eats', label: 'Eats', icon: '🍲' },
    { id: 'Events', label: 'Events', icon: '🎉' },
    { id: 'Voluntourism', label: 'Voluntourism', icon: '🌱' },
    { id: 'For a cause', label: 'For a cause', icon: '🤝' },
];

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ user, onRegister }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAlert, setShowAlert] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map State
  const [mapRadius, setMapRadius] = useState(20); // Default 20km
  const [is3DMode, setIs3DMode] = useState(false);

  // Helper to intercept actions
  const handleProtectedAction = () => {
    if (user.tier === 'Guest') {
      onRegister();
    } else {
      console.log('Action performed by registered user');
    }
  };

  const filteredListings = mockListings.filter(l => {
      const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const suggestedListings = mockListings.filter(l => 
    user.preferences?.includes(l.category) || l.rating >= 4.8
  ).slice(0, 5);

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
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 flex justify-between items-start animate-fade-in sticky top-0 z-30">
          <div className="flex items-start space-x-2">
            <Icon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </Icon>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Weather Alert</p>
              <p className="text-sm text-amber-900 leading-tight mt-0.5">Heavy rains expected in Bukidnon region.</p>
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
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 relative overflow-hidden shadow-sm">
             {user.tier === 'Guest' ? (
                 <Icon className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
             ) : (
                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
             )}
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search adventures in Northern Mindanao..."
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
            <Icon className="w-4 h-4"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Icon>
          </ViewToggleButton>
          <ViewToggleButton mode="map" label="Map View">
            <Icon className="w-4 h-4"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></Icon>
          </ViewToggleButton>
        </div>

        {/* Category Filters */}
        <div>
            <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${
                            selectedCategory === cat.id 
                            ? 'bg-stone-900 text-white border-stone-900' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Suggested For You */}
            {suggestedListings.length > 0 && selectedCategory === 'All' && !searchQuery && (
                <div>
                   <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
                       Suggested for You
                       <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Personalized</span>
                   </h2>
                   <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                      {suggestedListings.map(listing => (
                          <div key={listing.id} onClick={handleProtectedAction}>
                             <ListingCard listing={listing} />
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Campaign Banner */}
            <div onClick={handleProtectedAction} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
              <div className="relative z-10">
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Featured Campaign</span>
                <h2 className="font-bold text-xl mt-2">Tara sa Bukidnon! 🏔️</h2>
                <p className="text-sm mt-1 mb-4 opacity-90">Experience the highlands of Northern Mindanao. Get 20% off on stays.</p>
                <button className="bg-white text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-stone-100 transition-colors">
                  View Offers
                </button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20">
                 <Icon className="w-32 h-32"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></Icon>
              </div>
            </div>

            {/* Trending Now */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-stone-800 flex items-center">
                    <Icon className="w-5 h-5 text-orange-500 mr-2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Icon>
                    Trending Now
                </h2>
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                {filteredListings.filter(l => l.isTrending).map(listing => (
                  <div key={listing.id} onClick={handleProtectedAction}>
                      <ListingCard listing={listing} />
                  </div>
                ))}
                {filteredListings.filter(l => l.isTrending).length === 0 && (
                    <p className="text-sm text-stone-500 pl-4">No trending items in this category.</p>
                )}
              </div>
            </div>

            {/* New Destinations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-stone-800 flex items-center">
                    <Icon className="w-5 h-5 text-blue-500 mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></Icon>
                    New Destinations
                </h2>
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                {filteredListings.filter(l => l.isNew).map(listing => (
                  <div key={listing.id} onClick={handleProtectedAction}>
                      <ListingCard listing={listing} />
                  </div>
                ))}
                 {filteredListings.filter(l => l.isNew).length === 0 && (
                    <p className="text-sm text-stone-500 pl-4">No new items in this category.</p>
                )}
              </div>
            </div>
            
            {/* All Listings (Fallback Grid) */}
            <div>
                 <h2 className="text-lg font-bold text-stone-800 mb-4">Explore {selectedCategory !== 'All' ? selectedCategory : 'Everything'}</h2>
                 <div className="grid grid-cols-1 gap-4">
                     {filteredListings.slice(0, 10).map(listing => (
                         <div key={listing.id} className="flex bg-white p-3 rounded-xl shadow-sm border border-stone-100" onClick={handleProtectedAction}>
                             <img src={listing.imageUrl} className="w-20 h-20 rounded-lg object-cover bg-stone-200" />
                             <div className="ml-3 flex-1">
                                 <h3 className="font-bold text-stone-800 text-sm">{listing.title}</h3>
                                 <p className="text-xs text-stone-500 mb-2">{listing.location}</p>
                                 <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{listing.category}</span>
                                     <span className="text-sm font-bold text-stone-800">₱{listing.price}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

          </div>
        ) : (
            <div className="relative h-[600px] -mx-4 bg-stone-100 overflow-hidden">
               {/* Map Controls */}
               <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-none">
                    <div className="flex justify-between items-start pointer-events-auto">
                         {/* Radius Filter */}
                        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-stone-200 w-2/3">
                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 flex justify-between">
                                <span>Search Radius</span>
                                <span className="text-emerald-600">{mapRadius} km</span>
                            </label>
                            <input 
                                type="range" 
                                min="5" 
                                max="50" 
                                step="5"
                                value={mapRadius} 
                                onChange={(e) => setMapRadius(Number(e.target.value))}
                                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                                <span>5km</span>
                                <span>50km</span>
                            </div>
                        </div>

                        {/* 3D Toggle */}
                        <button 
                            onClick={() => setIs3DMode(!is3DMode)}
                            className={`p-3 rounded-xl shadow-lg border transition-all ${is3DMode ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-stone-600 border-stone-200'}`}
                        >
                            <span className="text-xs font-bold block">3D</span>
                        </button>
                    </div>
               </div>

              <div className="h-full w-full">
                <MapView 
                    listings={filteredListings} 
                    safetyZones={mockSafetyZones} 
                    radiusKm={mapRadius}
                    is3DMode={is3DMode}
                />
              </div>

               <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-stone-200">
                  <span className="text-xs font-bold text-stone-600">
                     Showing {filteredListings.length} listings within {mapRadius}km
                  </span>
               </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
