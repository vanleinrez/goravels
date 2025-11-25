
import React, { useState, useRef, useEffect } from 'react';
import type { User, ListingCategory, Listing } from '../types';
import { mockListings, mockSafetyZones } from '../constants';
import ListingCard from '../components/ListingCard';
import Icon from '../components/Icon';
import MapView, { MapViewHandle, MapLayerType } from '../components/MapView';

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
  const [mapLayer, setMapLayer] = useState<MapLayerType>('standard');
  const [mapPitch, setMapPitch] = useState(0);
  const [mapBearing, setMapBearing] = useState(0);
  
  // Location State
  const [userLocation, setUserLocation] = useState({ lat: 8.4542, lng: 124.6319 }); // Default CDO Fallback
  const [isLocating, setIsLocating] = useState(false);
  
  const [navigationRoute, setNavigationRoute] = useState<{from: {lat:number, lng:number}, to: {lat:number, lng:number}} | null>(null);

  // Listing Details & Booking
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookedListings, setBookedListings] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Map Controller Ref
  const mapRef = useRef<MapViewHandle>(null);

  // Initial Geolocation
  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLocation(newLoc);
        setIsLocating(false);
        
        // Fly to new location
        if (mapRef.current) {
            mapRef.current.flyTo(latitude, longitude);
        }
      },
      (error) => {
        console.error("Error retrieving location:", error);
        setIsLocating(false);
        // Fallback or Alert could go here
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Helper to intercept actions
  const handleProtectedAction = (listing?: Listing) => {
    if (user.tier === 'Guest') {
      onRegister();
    } else {
      if (listing) {
          setSelectedListing(listing);
      }
    }
  };

  const handleBook = () => {
      setIsProcessingPayment(true);
      setTimeout(() => {
          if (selectedListing) {
            setBookedListings(prev => [...prev, selectedListing.id]);
          }
          setIsProcessingPayment(false);
      }, 1500);
  };

  const handleGetDirection = () => {
      if (selectedListing) {
          // Close modal
          setSelectedListing(null);
          // Switch to map
          setViewMode('map');
          // Set standard layer (street view) for navigation
          setMapLayer('standard');
          // Set Route
          setNavigationRoute({
              from: userLocation,
              to: { lat: selectedListing.lat, lng: selectedListing.lng }
          });
          // Auto Tilt for better Nav view
          setMapPitch(60);
          setMapBearing(0);
      }
  };

  const resetNorth = () => {
      setMapBearing(0);
      setMapPitch(0);
  };

  const rotateMap = (deg: number) => {
      setMapBearing(prev => prev + deg);
  };

  const togglePitch = () => {
      setMapPitch(prev => prev === 0 ? 45 : 0);
  };

  const filteredListings = mockListings.filter(l => {
      const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  // Calculate filtered listings for map based on radius
  const mapListings = filteredListings.filter(l => {
      const R = 6371; // km
      const dLat = (l.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (l.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(l.lat * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance <= mapRadius;
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
      onClick={() => { setViewMode(mode); setNavigationRoute(null); setMapPitch(0); setMapBearing(0); }}
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
    <div className="bg-stone-50 min-h-full pb-20 relative">
      
      {/* --- LISTING DETAILS MODAL --- */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm"
                onClick={() => setSelectedListing(null)}
            ></div>
            
            {/* Modal Card */}
            <div className="bg-white w-full sm:max-w-md max-h-[90vh] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-y-auto pointer-events-auto relative animate-slide-in-right flex flex-col">
                {/* Image Header */}
                <div className="relative h-56 w-full flex-shrink-0">
                    <img src={selectedListing.imageUrl} alt={selectedListing.title} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setSelectedListing(null)}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30"
                    >
                        <Icon className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                    </button>
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                         <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{selectedListing.category}</span>
                         {selectedListing.isTrending && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center"><Icon className="w-3 h-3 mr-1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></Icon> Trending</span>}
                    </div>
                </div>

                <div className="p-6 pb-24">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-stone-800 leading-tight">{selectedListing.title}</h2>
                            <p className="text-stone-500 flex items-center mt-1 text-sm">
                                <Icon className="w-4 h-4 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                {selectedListing.location}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                <Icon className="w-4 h-4 text-yellow-500 fill-current mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
                                <span className="font-bold text-stone-800">{selectedListing.rating}</span>
                                <span className="text-xs text-stone-400 ml-1">({selectedListing.reviews})</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-stone-100 my-4" />

                    <h3 className="font-bold text-stone-800 mb-2">About</h3>
                    <p className="text-stone-600 text-sm leading-relaxed mb-6">
                        Experience the authentic charm of {selectedListing.location}. 
                        Perfect for travelers seeking {selectedListing.category.toLowerCase()}. 
                        Immerse yourself in local culture, enjoy breathtaking views, and create unforgettable memories.
                    </p>

                    {/* Mini Map Preview */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-stone-800">Location</h3>
                        </div>
                        <div className="h-32 w-full rounded-xl overflow-hidden relative bg-stone-100 border border-stone-200">
                             {/* Static Map Image Simulation */}
                             <div className="absolute inset-0 bg-emerald-50 flex items-center justify-center opacity-50">
                                  <Icon className="w-12 h-12 text-emerald-200"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                             </div>
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Icon className="w-8 h-8 text-emerald-600 animate-bounce"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                             </div>
                             <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-stone-500">
                                 {selectedListing.lat.toFixed(4)}, {selectedListing.lng.toFixed(4)}
                             </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                            <Icon className="w-6 h-6 mx-auto mb-1 text-emerald-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
                            <p className="text-[10px] font-bold text-stone-500 uppercase">Duration</p>
                            <p className="font-bold text-stone-800 text-sm">Day Trip</p>
                        </div>
                         <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                            <Icon className="w-6 h-6 mx-auto mb-1 text-blue-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>
                            <p className="text-[10px] font-bold text-stone-500 uppercase">Group Size</p>
                            <p className="font-bold text-stone-800 text-sm">Up to 10</p>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-100 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div>
                        <p className="text-stone-500 text-xs font-bold uppercase">Price</p>
                        <p className="text-2xl font-bold text-emerald-700">₱{selectedListing.price}</p>
                    </div>

                    {bookedListings.includes(selectedListing.id) ? (
                        <button 
                            onClick={handleGetDirection}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center"
                        >
                            <Icon className="w-5 h-5 mr-2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>
                            Get Direction
                        </button>
                    ) : (
                        <button 
                            onClick={handleBook}
                            disabled={isProcessingPayment}
                            className={`bg-stone-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center ${isProcessingPayment ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isProcessingPayment ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Processing...
                                </>
                            ) : 'Book Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

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
                          <div key={listing.id} onClick={() => handleProtectedAction(listing)}>
                             <ListingCard listing={listing} />
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Campaign Banner */}
            <div onClick={() => handleProtectedAction()} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
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
                  <div key={listing.id} onClick={() => handleProtectedAction(listing)}>
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
                  <div key={listing.id} onClick={() => handleProtectedAction(listing)}>
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
                         <div key={listing.id} className="flex bg-white p-3 rounded-xl shadow-sm border border-stone-100" onClick={() => handleProtectedAction(listing)}>
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
               <div className="absolute top-4 left-4 right-4 z-[1100] flex flex-col space-y-2 pointer-events-none">
                    
                    {/* Navigation Route Info */}
                    {navigationRoute && (
                         <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-500 pointer-events-auto flex justify-between items-center animate-fade-in">
                              <div>
                                  <p className="text-xs font-bold uppercase text-blue-200">Navigation Active</p>
                                  <p className="font-bold">To destination</p>
                              </div>
                              <button 
                                onClick={() => { setNavigationRoute(null); mapRef.current?.zoomOut(); resetNorth(); }}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-xs font-bold"
                              >
                                  End
                              </button>
                         </div>
                    )}

                    <div className="flex justify-between items-start pointer-events-auto space-x-2">
                         {/* Radius Filter (Hide when routing) */}
                        {!navigationRoute && (
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-stone-200 flex-1">
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
                                    onPointerDown={(e) => e.stopPropagation()} 
                                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                                    <span>5km</span>
                                    <span>50km</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Map Layer Select */}
                        <div className="flex-1 overflow-x-auto scrollbar-hide">
                            <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-stone-200 flex space-x-2">
                                {(['standard', 'satellite', 'hybrid', 'terrain'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMapLayer(type)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                                            mapLayer === type ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3D / Rotation Controls */}
                        <div className="flex flex-col space-y-2 pointer-events-auto">
                            {/* Compass / Reset North */}
                            <button 
                                onClick={resetNorth}
                                className="w-10 h-10 bg-white rounded-full shadow-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:text-red-500 active:scale-90 transition-transform relative"
                                title="Reset North"
                            >
                                <div style={{ transform: `rotate(${-mapBearing}deg)`, transition: 'transform 0.5s ease-in-out' }}>
                                    <Icon className="w-6 h-6"><polygon points="12 2 19 21 12 17 5 21 12 2" fill="currentColor" /></Icon>
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 text-[8px] font-bold text-red-500">N</span>
                                </div>
                            </button>

                            {/* 3D Toggle */}
                            <button 
                                onClick={togglePitch}
                                className={`w-10 h-10 rounded-full shadow-xl border flex items-center justify-center transition-all active:scale-90 ${mapPitch > 0 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-stone-600 border-stone-200'}`}
                            >
                                <span className="text-[10px] font-bold">3D</span>
                            </button>
                            
                            {/* Rotate Controls */}
                            <div className="flex bg-white rounded-full shadow-xl border border-stone-200 overflow-hidden w-10 flex-col">
                                <button onClick={() => rotateMap(-45)} className="h-8 flex items-center justify-center hover:bg-stone-50 border-b border-stone-100">
                                    <Icon className="w-4 h-4 text-stone-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></Icon>
                                </button>
                                <button onClick={() => rotateMap(45)} className="h-8 flex items-center justify-center hover:bg-stone-50">
                                    <Icon className="w-4 h-4 text-stone-500"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></Icon>
                                </button>
                            </div>
                        </div>
                    </div>
               </div>
               
               {/* Zoom & Location Controls */}
               <div className="absolute bottom-24 right-4 z-[1100] flex flex-col space-y-3 pointer-events-auto">
                    <button 
                        onClick={handleLocateMe}
                        className="w-10 h-10 bg-white rounded-full shadow-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-600 active:scale-90 transition-transform"
                        title="Get My Location"
                    >
                        <Icon className={`w-5 h-5 ${isLocating ? 'animate-spin text-emerald-600' : ''}`}>
                            {isLocating 
                                ? <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.122-7.878l-2.828 2.828M7.05 16.95l-2.828 2.828M16.95 16.95l2.828 2.828M7.05 7.05L4.222 4.222" /> 
                                : <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            }
                        </Icon>
                    </button>

                    <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                        <button 
                            onClick={() => mapRef.current?.zoomIn()}
                            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 active:bg-stone-100 border-b border-stone-100"
                        >
                            <Icon className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
                        </button>
                        <button 
                            onClick={() => mapRef.current?.zoomOut()}
                            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 active:bg-stone-100"
                        >
                             <Icon className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/></Icon>
                        </button>
                    </div>
               </div>

              <div className="h-full w-full">
                <MapView 
                    ref={mapRef}
                    listings={mapListings} 
                    safetyZones={mockSafetyZones} 
                    radiusKm={mapRadius}
                    userLocation={userLocation}
                    pitch={mapPitch}
                    bearing={mapBearing}
                    layerType={mapLayer}
                    route={navigationRoute}
                />
              </div>

               {/* Listings Count (Only show if not routing) */}
               {!navigationRoute && (
                   <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1100] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-stone-200 w-max max-w-[80%]">
                      <span className="text-xs font-bold text-stone-600 block text-center truncate">
                         {mapListings.length} listings in radius
                      </span>
                   </div>
               )}
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
