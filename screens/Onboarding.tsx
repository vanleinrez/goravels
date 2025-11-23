import React from 'react';
import Icon from '../components/Icon';
import { AuthStep } from '../App';

interface OnboardingProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
}

export const OnboardingFlow: React.FC<OnboardingProps> = ({ step, setStep }) => {
  if (step === 'splash') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="z-10 animate-bounce-gentle flex flex-col items-center">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
              <Icon className="w-12 h-12 text-emerald-600"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" /><path d="M11 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" /><path d="M19 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" /><path d="M3 4h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M11 4h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M19 4h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></Icon>
           </div>
           <h1 className="text-3xl font-bold tracking-tight">PitaKaBayan</h1>
           <p className="text-emerald-200 mt-2 font-medium tracking-widest text-sm uppercase">Gora</p>
        </div>
        <div className="absolute bottom-10 text-emerald-200 text-xs">
          Empowering Rural Tourism
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/ruralph/600/900" 
          alt="Rural Philippines" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
      </div>

      <div className="z-10 mt-auto p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover the unseen Philippines.</h1>
        <p className="text-stone-300 mb-8 text-lg">Connect with local hosts and experience authentic rural adventures.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setStep('signup')}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
          >
            Get Started
          </button>
          <button 
            onClick={() => setStep('signin')}
            className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};

export const SignInScreen: React.FC<{ onBack: () => void; onLogin: (role: 'traveler' | 'host') => void }> = ({ onBack, onLogin }) => (
  <div className="h-full bg-stone-50 p-6 flex flex-col">
    <button onClick={onBack} className="self-start text-stone-500 mb-8">
      <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
    </button>
    
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Welcome Back</h2>
      <p className="text-stone-500 mb-8">Sign in to continue your adventure.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Email</label>
          <input type="email" className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="juandelacruz@example.com" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Password</label>
          <input type="password" className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button onClick={() => onLogin('traveler')} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md">
          Sign In
        </button>
        <div className="text-center text-stone-400 text-xs py-2">OR</div>
        <button onClick={() => onLogin('host')} className="w-full py-3 bg-white border border-stone-300 text-stone-600 font-bold rounded-xl">
           Sign In as Host (Demo)
        </button>
      </div>
    </div>
  </div>
);

export const SignUpScreen: React.FC<{ onBack: () => void; onSignUpTraveler: () => void; onSignUpHost: () => void }> = ({ onBack, onSignUpTraveler, onSignUpHost }) => (
  <div className="h-full bg-stone-50 p-6 flex flex-col">
    <button onClick={onBack} className="self-start text-stone-500 mb-6">
      <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
    </button>
    
    <h2 className="text-2xl font-bold text-stone-800 mb-6">Choose your journey</h2>

    <div className="space-y-4">
      <div 
        onClick={onSignUpTraveler}
        className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all group"
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
           <Icon className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Icon>
        </div>
        <h3 className="font-bold text-lg text-stone-800">I am a Traveler</h3>
        <p className="text-stone-500 text-sm mt-1">I want to explore rural destinations, collect stamps, and book adventures.</p>
      </div>

      <div 
        onClick={onSignUpHost}
        className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all group"
      >
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
           <Icon className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
        </div>
        <h3 className="font-bold text-lg text-stone-800">I want to become a Host</h3>
        <p className="text-stone-500 text-sm mt-1">I want to share my community, culture, or property with travelers.</p>
      </div>
    </div>
  </div>
);