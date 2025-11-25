
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
type BookingStep = 'overview' | 'details' | 'payment';

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
  const [bookingStep, setBookingStep] = useState<BookingStep>('overview');
  const [bookedListings, setBookedListings] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [agreeTerms, setAgreeTerms] = useState(false);

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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleProtectedAction = (listing?: Listing) => {
    if (user.tier === 'Guest') {
      onRegister();
    } else {
      if (listing) {
          setSelectedListing(listing);
          setBookingStep('overview');
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
          setBookingStep('overview');
          setSelectedListing(null);
          alert("Booking Successful!");
      }, 2000);
  };

  const handleGetDirection = () => {
      if (selectedListing) {
          setSelectedListing(null);
          setViewMode('map');
          setMapLayer('standard');
          setNavigationRoute({
              from: userLocation,
              to: { lat: selectedListing.lat, lng: selectedListing.lng }
          });
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

  const filteredListings = mockListings.filter(l => {
      const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

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

  const renderModalContent = () => {
    if (!selectedListing) return null;

    // --- STEP 1: OVERVIEW ---
    if (bookingStep === 'overview') {
        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="relative h-64 sm:h-56 w-full flex-shrink-0 group">
                    <img src={selectedListing.imageUrl} alt={selectedListing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button 
                        onClick={() => setSelectedListing(null)}
                        className="absolute top-8 sm:top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors z-10"
                    >
                        <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                    </button>
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{selectedListing.category}</span>
                            {selectedListing.isTrending && <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center"><Icon className="w-3 h-3 mr-1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></Icon> Trending</span>}
                    </div>
                </div>

                <div className="p-6">
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
                        {selectedListing.description || `Experience the authentic charm of ${selectedListing.location}. Perfect for travelers seeking ${selectedListing.category.toLowerCase()}. Immerse yourself in local culture, enjoy breathtaking views, and create unforgettable memories.`}
                    </p>

                    <div className="flex space-x-4 mb-6">
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

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-stone-800">Location</h3>
                        </div>
                        <div className="h-32 w-full rounded-xl overflow-hidden relative bg-stone-100 border border-stone-200">
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

                    {/* Merged Footer Content (Scrollable, Non-Sticky) */}
                    <div className="pt-6 mt-4 border-t border-stone-100 pb-12">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-500 text-xs font-bold uppercase">Price</p>
                                <p className="text-2xl font-bold text-emerald-700">
                                    {selectedListing.price > 0 ? `₱${selectedListing.price}` : 'Free'}
                                </p>
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
                                    onClick={() => setBookingStep('details')}
                                    className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center hover:bg-stone-800"
                                >
                                    Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: DETAILS (Trip Info) ---
    if (bookingStep === 'details') {
        return (
            <>
            <div className="bg-white px-4 py-4 pt-12 sm:py-3 sm:pt-3 border-b border-stone-200 flex items-center sticky top-0 z-30 shadow-sm shrink-0">
                <button onClick={() => setBookingStep('overview')} className="p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors">
                    <Icon className="w-5 h-5"><path d="m15 18-6-6 6-6"/></Icon>
                </button>
                <h2 className="ml-2 font-bold text-stone-800">Trip Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-stone-50/50">
                
                {/* Host Info */}
                {selectedListing.host && (
                    <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                        <img src={selectedListing.host.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shadow-sm" alt={selectedListing.host.name} />
                        <div>
                            <p className="text-xs font-bold text-stone-400 uppercase">Hosted by</p>
                            <h3 className="font-bold text-stone-800">{selectedListing.host.name}</h3>
                            <p className="text-xs text-emerald-600 font-bold mb-1">{selectedListing.host.role}</p>
                            <p className="text-xs text-stone-500 leading-snug">"{selectedListing.host.bio}"</p>
                        </div>
                    </div>
                )}

                {/* Description - Repeated for detail context */}
                <div>
                     <h3 className="font-bold text-stone-800 mb-2">About This Experience</h3>
                     <p className="text-sm text-stone-600 leading-relaxed">
                        {selectedListing.description}
                     </p>
                </div>

                {/* How to get there */}
                <div>
                    <h3 className="font-bold text-stone-800 mb-2 flex items-center">
                        <Icon className="w-5 h-5 mr-2 text-blue-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></Icon>
                        How to Get There
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                        {selectedListing.howToGetThere || "Instructions available upon booking."}
                    </p>
                </div>

                {/* Itinerary */}
                {selectedListing.itinerary && (
                    <div>
                        <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                            <Icon className="w-5 h-5 mr-2 text-orange-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
                            Itinerary
                        </h3>
                        <div className="space-y-0 border-l-2 border-stone-200 ml-2.5">
                            {selectedListing.itinerary.map((item, idx) => (
                                <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300 border-2 border-white ring-2 ring-stone-100"></div>
                                    <p className="text-xs font-bold text-stone-400 mb-0.5">{item.time}</p>
                                    <p className="text-sm font-medium text-stone-800">{item.activity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Inclusions & Rules */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <h3 className="font-bold text-stone-800 mb-3">Inclusions</h3>
                        <div className="bg-white rounded-xl border border-stone-100 p-4">
                            <ul className="space-y-3">
                                {selectedListing.inclusions?.map((inc, i) => (
                                    <li key={i} className="flex items-center text-sm text-stone-600">
                                        <Icon className="w-4 h-4 mr-2 text-emerald-500"><polyline points="20 6 9 17 4 12"/></Icon>
                                        {inc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-stone-800 mb-3">Community Rules</h3>
                        <div className="space-y-2">
                             {selectedListing.rules?.map((rule, i) => (
                                 <div key={i} className="flex items-start p-3 bg-white border border-stone-100 rounded-lg">
                                     <span className="text-lg mr-3">{rule.icon || '⚠️'}</span>
                                     <div>
                                         <p className="text-xs font-bold text-stone-700">{rule.title}</p>
                                         <p className="text-[10px] text-stone-500 mt-0.5">{rule.text}</p>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                 {/* Price Breakdown */}
                 {selectedListing.priceBreakdown && (
                    <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                         <h3 className="font-bold text-stone-800 mb-3 flex items-center">
                            <Icon className="w-5 h-5 mr-2 text-emerald-600"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Icon>
                            Price Breakdown
                        </h3>
                        <div className="space-y-2">
                             {selectedListing.priceBreakdown.map((item, i) => (
                                 <div key={i} className="flex justify-between text-sm text-stone-600">
                                     <span>{item.item}</span>
                                     <span>₱{item.amount.toLocaleString()}</span>
                                 </div>
                             ))}
                             <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100 mt-2">
                                 <span>Total</span>
                                 <span className="text-emerald-700">₱{selectedListing.price.toLocaleString()}</span>
                             </div>
                        </div>
                    </div>
                )}

                {/* Refund Policy */}
                <div className="bg-stone-100 p-4 rounded-xl border border-stone-200">
                     <h3 className="font-bold text-stone-700 text-xs uppercase mb-1">Refund Policy</h3>
                     <p className="text-xs text-stone-500 leading-relaxed">
                         {selectedListing.refundPolicy || "Standard policy applies."}
                     </p>
                </div>

                {/* Non-sticky Book Now Button (Merged into scroll content) */}
                <div className="pt-4 pb-16">
                     <button 
                        onClick={() => setBookingStep('payment')}
                        className="w-full bg-stone-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center hover:bg-stone-800"
                    >
                        Book Now
                    </button>
                </div>
            </div>
            </>
        );
    }

    // --- STEP 3: PAYMENT ---
    if (bookingStep === 'payment') {
        const total = selectedListing.price;
        return (
            <>
            <div className="bg-white px-4 py-4 pt-12 sm:py-3 sm:pt-3 border-b border-stone-200 flex items-center sticky top-0 z-30 shadow-sm shrink-0">
                <button onClick={() => setBookingStep('details')} className="p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors">
                    <Icon className="w-5 h-5"><path d="m15 18-6-6 6-6"/></Icon>
                </button>
                <h2 className="ml-2 font-bold text-stone-800">Review & Pay</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-stone-50/50">
                
                {/* Order Summary */}
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <h3 className="font-bold text-stone-800 mb-3">Booking Summary</h3>
                    <div className="flex items-center mb-4">
                         <img src={selectedListing.imageUrl} className="w-16 h-16 rounded-lg object-cover mr-3 bg-stone-200" />
                         <div>
                             <p className="font-bold text-sm text-stone-800">{selectedListing.title}</p>
                             <p className="text-xs text-stone-500">{selectedListing.location}</p>
                             <p className="text-xs text-stone-500 mt-1">1 Guest • {selectedListing.category}</p>
                         </div>
                    </div>
                    
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                         {selectedListing.priceBreakdown ? selectedListing.priceBreakdown.map((item, i) => (
                             <div key={i} className="flex justify-between text-xs text-stone-600">
                                 <span>{item.item}</span>
                                 <span>₱{item.amount.toLocaleString()}</span>
                             </div>
                         )) : (
                             <div className="flex justify-between text-xs text-stone-600">
                                 <span>Base Rate</span>
                                 <span>₱{selectedListing.price.toLocaleString()}</span>
                             </div>
                         )}
                         <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100 mt-2">
                             <span>Total</span>
                             <span className="text-emerald-700 text-lg">₱{total.toLocaleString()}</span>
                         </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div>
                    <h3 className="font-bold text-stone-800 mb-3">Payment Method</h3>
                    <div className="space-y-2">
                         {['GCash', 'Maya', 'Credit/Debit Card'].map(method => (
                             <label key={method} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-stone-200 hover:border-emerald-200'}`}>
                                 <div className="flex items-center">
                                     <input 
                                        type="radio" 
                                        name="payment" 
                                        className="mr-3 h-5 w-5 text-emerald-600 focus:ring-emerald-500" 
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                     />
                                     <span className="font-medium text-stone-700">{method}</span>
                                 </div>
                                 <Icon className={`w-5 h-5 ${paymentMethod === method ? 'text-emerald-600' : 'text-stone-300'}`}>
                                     {method === 'Credit/Debit Card' ? <rect x="2" y="5" width="20" height="14" rx="2" /> : <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
                                 </Icon>
                             </label>
                         ))}
                    </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <label className="flex items-start cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="mt-1 mr-3 h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)} 
                        />
                        <span className="text-xs text-stone-600 leading-snug">
                            I agree to the <span className="font-bold underline">Terms & Conditions</span>, <span className="font-bold underline">Refund Policy</span>, and <span className="font-bold underline">Community Guidelines</span> regarding local culture and environment protection.
                        </span>
                    </label>
                </div>
            </div>

            <div className="p-4 pb-8 sm:pb-4 bg-white border-t border-stone-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 shrink-0">
                <button 
                    onClick={handleBook}
                    disabled={!agreeTerms || isProcessingPayment}
                    className={`w-full bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center ${(!agreeTerms || isProcessingPayment) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-500'}`}
                >
                    {isProcessingPayment ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                        </>
                    ) : `Pay ₱${total.toLocaleString()} & Book`}
                </button>
            </div>
            </>
        );
    }
  };

  return (
    <div className="bg-stone-50 min-h-full pb-20 relative">
      
      {/* --- LISTING DETAILS MODAL --- */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedListing(null)}
            ></div>
            
            {/* Modal Card - Full screen on Mobile, Modal on Desktop */}
            <div className={`bg-white w-full h-full sm:h-[85vh] sm:w-full sm:max-w-md sm:rounded-2xl shadow-2xl pointer-events-auto relative animate-slide-in-right flex flex-col overflow-hidden transition-all duration-300`}>
                {renderModalContent()}
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
                    <Icon className="w-5 h-5 text-orange-500 mr-2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12 17 12" /></Icon>
                    Trending Now
                </h2>
                <button className="text-xs font-bold text-emerald-600">See All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredListings.filter(l => l.isTrending).map(listing => (
                  <div key={listing.id} onClick={() => handleProtectedAction(listing)} className="flex bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer active:scale-95 transition-transform">
                    <img src={listing.imageUrl} alt={listing.title} className="w-24 h-24 object-cover" />
                    <div className="p-3 flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-stone-800 text-sm mb-1">{listing.title}</h3>
                      <p className="text-xs text-stone-500 mb-2">{listing.location}</p>
                      <div className="flex justify-between items-center">
                          <span className="text-emerald-600 font-bold text-sm">₱{listing.price}</span>
                          <div className="flex items-center text-[10px] text-stone-400">
                             <span className="text-yellow-400 mr-1">★</span> {listing.rating}
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Listings */}
            <div>
               <h2 className="text-lg font-bold text-stone-800 mb-4">All Adventures</h2>
               <div className="space-y-4">
                  {filteredListings.map(listing => (
                      <div key={listing.id} onClick={() => handleProtectedAction(listing)} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer active:scale-95 transition-transform">
                          <div className="h-40 relative">
                              <img src={listing.imageUrl} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                  {listing.category}
                              </div>
                          </div>
                          <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <h3 className="font-bold text-lg text-stone-800">{listing.title}</h3>
                                      <p className="text-stone-500 text-xs flex items-center mt-1">
                                          <Icon className="w-3 h-3 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                          {listing.location}
                                      </p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <span className="font-bold text-emerald-700 text-lg">₱{listing.price}</span>
                                      <div className="flex items-center text-xs text-stone-500">
                                          <Icon className="w-3 h-3 text-yellow-400 fill-current mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
                                          {listing.rating} ({listing.reviews})
                                      </div>
                                  </div>
                              </div>
                              <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                                  {listing.description || `Discover the beauty of ${listing.location}. A perfect getaway for ${listing.category} lovers.`}
                              </p>
                          </div>
                      </div>
                  ))}
               </div>
            </div>

          </div>
        ) : (
          <div className="h-[calc(100vh-250px)] w-full rounded-2xl overflow-hidden shadow-inner border border-stone-200 relative animate-fade-in">
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
            
            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button onClick={() => mapRef.current?.zoomIn()} className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon></button>
                <button onClick={() => mapRef.current?.zoomOut()} className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/></Icon></button>
                <button onClick={() => mapRef.current?.centerOnUser()} className={`p-2 rounded-lg shadow-md transition-colors ${isLocating ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                    <Icon className="w-5 h-5"><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z"/><circle cx="12" cy="10" r="3"/></Icon>
                </button>
                <div className="relative group">
                     <button className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Icon></button>
                     <div className="absolute right-full top-0 mr-2 bg-white rounded-lg shadow-lg p-2 hidden group-hover:flex flex-col space-y-1 min-w-[100px]">
                         {(['standard', 'satellite', 'hybrid', 'terrain'] as MapLayerType[]).map(t => (
                             <button key={t} onClick={() => setMapLayer(t)} className={`text-xs text-left px-2 py-1 rounded ${mapLayer === t ? 'bg-emerald-50 text-emerald-600 font-bold' : 'hover:bg-stone-50'}`}>
                                 {t.charAt(0).toUpperCase() + t.slice(1)}
                             </button>
                         ))}
                     </div>
                </div>
                {mapBearing !== 0 && (
                    <button onClick={resetNorth} className="bg-white p-2 rounded-lg shadow-md text-red-500 font-bold text-xs" style={{ transform: `rotate(${mapBearing}deg)` }}>
                        N
                    </button>
                )}
            </div>

            {/* Map 3D Controls */}
            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-end pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg pointer-events-auto space-y-2">
                     <p className="text-[10px] font-bold text-stone-400 uppercase">Search Radius: {mapRadius}km</p>
                     <input 
                        type="range" 
                        min="5" max="100" 
                        value={mapRadius} 
                        onChange={(e) => setMapRadius(Number(e.target.value))}
                        className="w-32 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                     />
                 </div>
                 
                 <div className="pointer-events-auto flex space-x-2">
                     <button onClick={() => setMapPitch(p => p === 0 ? 60 : 0)} className={`px-3 py-2 rounded-lg shadow-md text-xs font-bold transition-colors ${mapPitch > 0 ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600'}`}>
                         3D
                     </button>
                     <button onClick={() => rotateMap(45)} className="bg-white px-3 py-2 rounded-lg shadow-md text-xs font-bold text-stone-600">
                         Rotate
                     </button>
                 </div>
            </div>
            
            {navigationRoute && (
                 <div className="absolute top-4 left-4 right-16 bg-blue-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between animate-slide-in-right z-10">
                     <div className="flex items-center">
                         <Icon className="w-5 h-5 mr-2 animate-pulse"><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>
                         <div>
                             <p className="text-xs font-bold opacity-80">Navigating to</p>
                             <p className="text-sm font-bold truncate max-w-[150px]">{mockListings.find(l => l.lat === navigationRoute.to.lat)?.title || 'Destination'}</p>
                         </div>
                     </div>
                     <button onClick={() => { setNavigationRoute(null); setMapPitch(0); setMapBearing(0); }} className="bg-white/20 p-1.5 rounded-full hover:bg-white/30">
                         <Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                     </button>
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
