import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { AuthStep } from '../App';

interface OnboardingProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
}

const carouselData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1598556776374-1b7724213d28?q=80&w=1000&auto=format&fit=crop', // Community/People
    title: 'Community Immersion',
    desc: 'Connect with locals and experience the warmth of true Filipino hospitality.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1533653896580-b0b304675402?q=80&w=1000&auto=format&fit=crop', // Experience/Activity
    title: 'Authentic Experiences',
    desc: 'Rice planting, harvesting, and living a day in the life of the barrio.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1595964267468-d731885f8386?q=80&w=1000&auto=format&fit=crop', // Rural Stay/Hut
    title: 'Rural Stays',
    desc: 'Sleep in bamboo cottages, eco-lodges, and peaceful farm stays.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605218427360-69279a321d51?q=80&w=1000&auto=format&fit=crop', // Food
    title: 'Local Flavors',
    desc: 'Farm-to-table dining and authentic provincial cuisine.'
  }
];

export const OnboardingFlow: React.FC<OnboardingProps> = ({ step, setStep }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel Auto-play
  useEffect(() => {
    if (step === 'welcome') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [step]);

  if (step === 'splash') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="z-10 flex flex-col items-center">
           {/* Animated Logo Container */}
           <div className="relative w-64 h-32">
              <svg viewBox="0 0 300 150" className="w-full h-full">
                <style>
                  {`
                    .draw-path {
                      stroke-dasharray: 100;
                      stroke-dashoffset: 100;
                      animation: draw 1s ease-out forwards 0.5s;
                    }
                    .pop-in {
                      opacity: 0;
                      transform-box: fill-box;
                      transform-origin: center;
                      animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 1.2s;
                    }
                    .fade-up {
                      opacity: 0;
                      transform: translateY(10px);
                      animation: fadeUp 0.8s ease-out forwards;
                    }
                    @keyframes draw {
                      to { stroke-dashoffset: 0; }
                    }
                    @keyframes pop {
                      0% { opacity: 0; transform: scale(0); }
                      100% { opacity: 1; transform: scale(1); }
                    }
                    @keyframes fadeUp {
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}
                </style>

                {/* Gora Text - Teal */}
                <text x="40" y="80" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="80" fill="#0d9488" className="fade-up">
                  Gora
                </text>

                {/* Dashed Path - Pink */}
                <path 
                  d="M 60 100 Q 120 130 180 100 T 240 90" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  className="draw-path"
                  style={{ strokeDasharray: 200 }} 
                />

                {/* Paw Print - Orange */}
                <g className="pop-in">
                   {/* Main Pad */}
                   <path d="M 250 85 C 245 95, 255 105, 265 100 C 275 95, 275 80, 265 75 C 255 70, 250 75, 250 85 Z" fill="#f59e0b" />
                   {/* Toes */}
                   <circle cx="245" cy="70" r="5" fill="#f59e0b" />
                   <circle cx="258" cy="62" r="5" fill="#f59e0b" />
                   <circle cx="272" cy="70" r="5" fill="#f59e0b" />
                   <circle cx="280" cy="82" r="5" fill="#f59e0b" />
                </g>
              </svg>
           </div>
           
           <p className="text-emerald-800 mt-4 font-medium tracking-widest text-xs uppercase animate-pulse">
             Tara, Gora na!
           </p>
        </div>
      </div>
    );
  }

  // Welcome Screen (Carousel)
  return (
    <div className="h-full flex flex-col bg-stone-50 animate-fade-in relative">
      
      {/* Top Banner / Hero Logo */}
      <div className="pt-8 pb-4 flex flex-col items-center justify-center bg-white z-20 shadow-sm relative">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">Gora</span>
            <Icon className="w-6 h-6 text-orange-500 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></Icon>
          </div>
          <p className="text-sm font-medium text-emerald-800 mt-1 uppercase tracking-widest">Tara, Gora na!</p>
      </div>

      {/* Carousel Section */}
      <div className="flex-1 relative overflow-hidden bg-stone-900">
        {carouselData.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover opacity-80"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 text-white transform transition-transform duration-700">
              <span className="inline-block px-3 py-1 bg-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                Discover
              </span>
              <h2 className="text-3xl font-bold mb-2 leading-tight">{slide.title}</h2>
              <p className="text-stone-300 font-light text-lg leading-snug">{slide.desc}</p>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-6 pb-8 space-y-3 z-20 rounded-t-2xl -mt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setStep('signup')}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex justify-center items-center"
        >
          Get Started
        </button>
        <button 
          onClick={() => setStep('signin')}
          className="w-full py-4 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold rounded-xl transition-all active:scale-95"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};

export const SignInScreen: React.FC<{ onBack: () => void; onLogin: (role: 'traveler' | 'host') => void }> = ({ onBack, onLogin }) => (
  <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
    <button onClick={onBack} className="self-start text-stone-500 mb-8 p-2 hover:bg-stone-200 rounded-full transition-colors">
      <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
    </button>
    
    <div className="flex-1">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Welcome Back</h2>
        <p className="text-stone-500">Sign in to continue your adventure.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase mb-2 ml-1">Email</label>
          <input type="email" className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" placeholder="juandelacruz@example.com" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 uppercase mb-2 ml-1">Password</label>
          <input type="password" className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" placeholder="••••••••" />
          <div className="text-right mt-2">
            <button className="text-xs text-emerald-600 font-bold hover:underline">Forgot Password?</button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <button onClick={() => onLogin('traveler')} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex justify-center items-center">
          <span className="mr-2">Sign In</span>
          <Icon className="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Icon>
        </button>
        
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-stone-50 px-2 text-stone-400">Or continue with</span></div>
        </div>

        <button onClick={() => onLogin('host')} className="w-full py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold rounded-xl transition-all flex justify-center items-center">
           Host Demo Account
        </button>
      </div>
    </div>
  </div>
);

export const SignUpScreen: React.FC<{ onBack: () => void; onSignUpTraveler: () => void; onSignUpHost: () => void }> = ({ onBack, onSignUpTraveler, onSignUpHost }) => (
  <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
    <button onClick={onBack} className="self-start text-stone-500 mb-6 p-2 hover:bg-stone-200 rounded-full transition-colors">
      <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
    </button>
    
    <h2 className="text-3xl font-bold text-stone-800 mb-8">Choose your<br/>journey</h2>

    <div className="space-y-4">
      <div 
        onClick={onSignUpTraveler}
        className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all group active:scale-95"
      >
        <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Icon className="w-7 h-7"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Icon>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-stone-200 group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-colors"></div>
        </div>
        <h3 className="font-bold text-xl text-stone-800 group-hover:text-emerald-700">I am a Traveler</h3>
        <p className="text-stone-500 text-sm mt-2 leading-relaxed">I want to explore rural destinations, collect stamps, and book adventures.</p>
      </div>

      <div 
        onClick={onSignUpHost}
        className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all group active:scale-95"
      >
        <div className="flex justify-between items-start mb-4">
             <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon className="w-7 h-7"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-stone-200 group-hover:border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
        </div>
        <h3 className="font-bold text-xl text-stone-800 group-hover:text-orange-700">I want to be a Host</h3>
        <p className="text-stone-500 text-sm mt-2 leading-relaxed">I want to share my community, culture, or property with travelers.</p>
      </div>
    </div>
  </div>
);