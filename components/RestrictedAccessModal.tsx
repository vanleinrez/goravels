
import React from 'react';
import Icon from './Icon';

interface RestrictedAccessModalProps {
  onBackToOnboarding: () => void;
  onCancel: () => void;
}

const RestrictedAccessModal: React.FC<RestrictedAccessModalProps> = ({ onBackToOnboarding, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
        
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 border-4 border-stone-50">
           <Icon className="w-8 h-8 text-stone-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
        </div>

        <h2 className="text-xl font-bold text-stone-800 mb-2">Registration Required</h2>
        
        <p className="text-stone-600 text-sm leading-relaxed mb-8">
          You must be a register traveler to use this feature. Please click back to onboarding screen.
        </p>

        <div className="w-full space-y-3">
          <button 
            onClick={onBackToOnboarding}
            className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
          >
            Back to Onboarding
          </button>
          
          <button 
            onClick={onCancel}
            className="w-full py-3.5 text-stone-500 font-bold text-sm hover:bg-stone-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default RestrictedAccessModal;
