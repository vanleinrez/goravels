
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import type { Listing } from '../types';
import SosScreen from './SosScreen';

interface ActivityScreenProps {
  activeTrip: Listing;
  onClose: () => void;
  isSosActive: boolean;
  onSosStateChange: (active: boolean) => void;
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ activeTrip, onClose, isSosActive, onSosStateChange }) => {
  const [sosPressTimer, setSosPressTimer] = useState(0);
  const [showSosModal, setShowSosModal] = useState(false);
  const sosIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // If SOS is already active globally when we open this screen, show the modal in SENT state
  useEffect(() => {
    if (isSosActive) {
      setShowSosModal(true);
    }
  }, [isSosActive]);

  // SOS Logic
  const startSosPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid scrolling/context menu issues during long press
    // e.preventDefault(); 
    setSosPressTimer(0);
    sosIntervalRef.current = setInterval(() => {
      setSosPressTimer((prev) => {
        if (prev >= 100) {
          if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
          setShowSosModal(true);
          return 100;
        }
        return prev + 2; // Approx 3 seconds
      });
    }, 60);
  };

  const endSosPress = () => {
    if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    setSosPressTimer(0);
  };

  const handleMinimizeSos = () => {
      onSosStateChange(true); // Ensure global state is active
      setShowSosModal(false); // Hide modal
      onClose(); // Close Activity Screen to reveal underlying map/app
  };

  const handleResolveSos = () => {
      onSosStateChange(false); // Clear global state
      setShowSosModal(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-stone-50 animate-slide-in-right flex flex-col h-full">
      {/* SOS Modal Overlay */}
      {showSosModal && (
        <div className="absolute inset-0 z-[70] bg-stone-900">
            <SosScreen 
                initialStep={isSosActive ? "SENT" : "LEVEL_SELECT"}
                onComplete={handleResolveSos}
                onMinimize={handleMinimizeSos}
                onClose={() => setShowSosModal(false)}
            />
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Ongoing Activity</span>
          <h1 className="font-bold text-stone-800 text-lg leading-none mt-1">{activeTrip.title}</h1>
        </div>
        <button onClick={onClose} className="bg-stone-100 p-2 rounded-full text-stone-500 hover:bg-stone-200">
          <Icon className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image */}
        <div className="h-64 relative">
          <img src={activeTrip.imageUrl} className="w-full h-full object-cover" alt="Active Trip" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-bold text-2xl">₱{activeTrip.price}</p>
            <p className="text-sm opacity-90">{activeTrip.category}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Host Profile Mini */}
          {activeTrip.host && (
            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center space-x-4">
              <img src={activeTrip.host.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" />
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Your Guide</p>
                <h3 className="font-bold text-stone-800">{activeTrip.host.name}</h3>
                <p className="text-xs text-stone-500">{activeTrip.host.role}</p>
              </div>
              <div className="ml-auto">
                <button className="bg-stone-900 text-white p-2 rounded-full"><Icon className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon></button>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-bold text-stone-800 mb-2">Activity Description</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{activeTrip.description}</p>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="font-bold text-stone-800 mb-4 flex items-center">
              <Icon className="w-5 h-5 mr-2 text-orange-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
              Schedule
            </h3>
            <div className="space-y-0 border-l-2 border-stone-200 ml-2.5">
              {activeTrip.itinerary?.map((item, idx) => (
                <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-2 ring-stone-100 ${idx === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`}></div>
                  <p className="text-xs font-bold text-stone-400 mb-0.5">{item.time}</p>
                  <p className={`text-sm font-medium ${idx === 1 ? 'text-emerald-700 font-bold' : 'text-stone-800'}`}>{item.activity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 flex justify-between items-center">
            <span className="font-bold text-stone-600">Total Paid</span>
            <span className="font-bold text-stone-800 text-lg">₱{activeTrip.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* --- FLOATING SOS BUBBLE (ONLY IN ACTIVITY SCREEN) --- */}
      <div className="absolute bottom-8 right-6 z-50">
        <button
          onMouseDown={startSosPress}
          onMouseUp={endSosPress}
          onMouseLeave={endSosPress}
          onTouchStart={startSosPress}
          onTouchEnd={endSosPress}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white active:scale-95 transition-transform ${isSosActive ? 'bg-red-600 animate-pulse' : 'bg-red-600'}`}
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="289.02"
              strokeDashoffset={289.02 - (289.02 * sosPressTimer) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
          <Icon className="w-8 h-8 font-bold"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></Icon>
        </button>
        <p className={`text-[10px] font-bold text-center mt-2 bg-white/80 backdrop-blur rounded px-2 py-1 shadow-sm ${isSosActive ? 'text-red-600 animate-pulse' : 'text-red-600'}`}>
            {isSosActive ? 'SOS ACTIVE' : 'Hold 3s for SOS'}
        </p>
      </div>
    </div>
  );
};

export default ActivityScreen;
