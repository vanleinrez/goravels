
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { AuthStep } from '../App';

interface OnboardingProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  setContext: (context: 'new' | 'existing') => void;
}

const carouselData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518182170546-0766ba6f9285?q=80&w=1000&auto=format&fit=crop', // Community/Interaction
    title: 'Community Immersion',
    desc: 'Connect with locals and experience the warmth of true Filipino hospitality.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1533653896580-b0b304675402?q=80&w=1000&auto=format&fit=crop', // Rice Terraces/Activity
    title: 'Authentic Experiences',
    desc: 'Rice planting, harvesting, and living a day in the life of the barrio.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519114056088-b877fe073a1e?q=80&w=1000&auto=format&fit=crop', // Rural Hut/Stay
    title: 'Rural Stays',
    desc: 'Sleep in bamboo cottages, eco-lodges, and peaceful farm stays.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605218427360-69279a321d51?q=80&w=1000&auto=format&fit=crop', // Filipino Food
    title: 'Local Flavors',
    desc: 'Farm-to-table dining and authentic provincial cuisine.'
  }
];

// Reusable Logo Component
const BrandLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 300 150" className={className}>
    <text x="50" y="95" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="80" fill="#0d9488">Gora</text>
    <path d="M 60 110 Q 120 140 180 110 T 240 100" fill="none" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" style={{ strokeDasharray: '15, 15' }} />
    <g transform="translate(15, 15)">
        <path d="M 250 85 C 245 95, 255 105, 265 100 C 275 95, 275 80, 265 75 C 255 70, 250 75, 250 85 Z" fill="#f59e0b" />
        <circle cx="245" cy="70" r="5" fill="#f59e0b" />
        <circle cx="258" cy="62" r="5" fill="#f59e0b" />
        <circle cx="272" cy="70" r="5" fill="#f59e0b" />
        <circle cx="280" cy="82" r="5" fill="#f59e0b" />
    </g>
  </svg>
);

export const OnboardingFlow: React.FC<OnboardingProps> = ({ step, setStep, setContext }) => {
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
        
        <div className="z-10 flex flex-col items-center animate-fade-in">
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
      <div className="pt-10 pb-8 flex flex-col items-center justify-center bg-white z-20 shadow-sm relative rounded-b-[2.5rem]">
          <div className="w-48 h-24 relative">
             <BrandLogo />
          </div>
          <div className="text-center mt-2 space-y-1 px-4">
             <p className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.25em]">Power on your adventure</p>
             <h1 className="text-3xl font-black text-stone-800 italic tracking-tighter transform -rotate-2">
                Tara, <span className="text-emerald-600">Gora Na!</span>
             </h1>
          </div>
      </div>

      {/* Carousel Section */}
      <div className="flex-1 relative overflow-hidden bg-stone-900 -mt-10 pt-10">
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
              <span className="inline-block px-3 py-1 bg-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg">
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
          onClick={() => { setContext('new'); setStep('mobile-entry'); }}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex justify-center items-center"
        >
          Get Started
        </button>
        <button 
          onClick={() => { setContext('existing'); setStep('login-role-selection'); }}
          className="w-full py-4 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold rounded-xl transition-all active:scale-95"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};

// --- Mobile Entry Screen ---
export const MobileEntryScreen: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const [mobile, setMobile] = useState('');

  return (
    <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
      <button onClick={onBack} className="self-start text-stone-500 mb-8 p-2 hover:bg-stone-200 rounded-full transition-colors">
        <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
      </button>

      <h2 className="text-3xl font-bold text-stone-800 mb-2">Let's start with<br/>your number</h2>
      <p className="text-stone-500 mb-8">We'll send you a code to verify it's you.</p>

      <div className="flex space-x-3 mb-6">
        <div className="w-20 p-4 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 font-bold flex items-center justify-center">
          🇵🇭 +63
        </div>
        <input 
          type="tel" 
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="900 000 0000"
          className="flex-1 p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-lg tracking-wide font-medium"
        />
      </div>

      <button 
        onClick={onNext}
        disabled={mobile.length < 10}
        className={`w-full py-4 font-bold rounded-xl transition-all flex justify-center items-center ${
          mobile.length >= 10 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 active:scale-95' 
          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        }`}
      >
        Send Code
      </button>
    </div>
  );
};

// --- OTP Screen ---
export const OTPScreen: React.FC<{ 
  onBack: () => void; 
  onVerify: () => void; 
}> = ({ onBack, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLElement).focus();
    }
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
      <button onClick={onBack} className="self-start text-stone-500 mb-8 p-2 hover:bg-stone-200 rounded-full transition-colors">
        <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
      </button>

      <h2 className="text-3xl font-bold text-stone-800 mb-2">Enter the code</h2>
      <p className="text-stone-500 mb-8">Sent to +63 9** *** ****</p>

      <div className="flex justify-between mb-8">
        {otp.map((data, index) => (
          <input
            className="w-12 h-14 border border-stone-300 rounded-xl text-center text-xl font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
            type="text"
            name="otp"
            maxLength={1}
            key={index}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>

      <p className="text-center text-stone-500 text-sm mb-8">
        Didn't receive it? <button className="text-emerald-600 font-bold">Resend in 30s</button>
      </p>

      <button 
        onClick={onVerify}
        disabled={!isComplete}
        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center ${
            isComplete
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        }`}
      >
        Verify
      </button>
    </div>
  );
};

// --- Login Role Selection Screen (Existing Users) ---
export const LoginRoleSelectionScreen: React.FC<{ 
  onBack: () => void; 
  onSelectHost: () => void; 
  onSelectTraveler: () => void; 
}> = ({ onBack, onSelectHost, onSelectTraveler }) => {
  return (
    <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
       <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-stone-500 p-2 hover:bg-stone-200 rounded-full transition-colors">
            <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
          </button>
       </div>

       <h2 className="text-3xl font-bold text-stone-800 mb-2">Welcome back!</h2>
       <p className="text-stone-500 mb-8">Choose how you want to continue.</p>

       <div className="space-y-4 flex-1">
        <div 
          onClick={onSelectTraveler}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all group active:scale-95 relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
               <Icon className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Icon>
             </div>
             <div>
                 <h3 className="font-bold text-lg text-stone-800">I am a Traveler</h3>
                 <p className="text-stone-500 text-xs">Continue exploring</p>
             </div>
          </div>
        </div>

        <div 
          onClick={onSelectHost}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all group active:scale-95 relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <Icon className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
             </div>
             <div>
                 <h3 className="font-bold text-lg text-stone-800">I am a Host</h3>
                 <p className="text-stone-500 text-xs">Manage your listings</p>
             </div>
          </div>
        </div>
       </div>
    </div>
  );
};

// --- Role Selection Screen (New Users) ---
export const RoleSelectionScreen: React.FC<{ 
  onBack: () => void; 
  onSelectTraveler: () => void; 
  onSelectHost: () => void;
  onSkip: () => void;
}> = ({ onBack, onSelectTraveler, onSelectHost, onSkip }) => {
  return (
    <div className="h-full bg-stone-50 p-6 flex flex-col animate-slide-in-right">
       <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-stone-500 p-2 hover:bg-stone-200 rounded-full transition-colors">
            <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
          </button>
          <button onClick={onSkip} className="text-sm font-bold text-stone-400 hover:text-stone-600">Skip</button>
       </div>

       <h2 className="text-3xl font-bold text-stone-800 mb-8">What's your<br/>call?</h2>

       <div className="space-y-4 flex-1">
        <div 
          onClick={onSelectTraveler}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all group active:scale-95 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
             <Icon className="w-32 h-32"><circle cx="12" cy="12" r="10"/></Icon>
          </div>
          <div className="relative z-10">
             <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
               <Icon className="w-7 h-7"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Icon>
             </div>
             <h3 className="font-bold text-xl text-stone-800">I am a Traveler</h3>
             <p className="text-stone-500 text-sm mt-2">Explore rural destinations and collect stamps.</p>
          </div>
        </div>

        <div 
          onClick={onSelectHost}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all group active:scale-95 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
             <Icon className="w-32 h-32"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></Icon>
          </div>
          <div className="relative z-10">
             <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                <Icon className="w-7 h-7"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
             </div>
             <h3 className="font-bold text-xl text-stone-800">I want to be a Host</h3>
             <p className="text-stone-500 text-sm mt-2">Share your community and culture.</p>
          </div>
        </div>
       </div>
    </div>
  );
}

// --- Traveler Registration Screen ---
export const TravelerRegistrationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="h-full bg-stone-50 flex flex-col animate-slide-in-right">
      <div className="bg-white px-6 py-4 border-b border-stone-200 sticky top-0 z-10">
        <h1 className="font-bold text-stone-800">Traveler Registration</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
         <div className="space-y-6">
            <h2 className="font-bold text-lg text-stone-800">Basic Details</h2>
            <div className="space-y-3">
              <Input label="Nickname" placeholder="What should we call you?" />
              <Input label="Full Name" placeholder="Juan Dela Cruz" />
              <Input label="Birthday" type="date" />
              <Input label="Nationality" placeholder="Filipino" />
              <Input label="State / Province" placeholder="Bukidnon" />
              <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Gender</label>
                  <div className="flex space-x-3">
                      {['Male', 'Female', 'Prefer not to say'].map(g => (
                        <label key={g} className="flex items-center px-3 py-2 border rounded-lg bg-white">
                           <input type="radio" name="gender" className="mr-2" /> <span className="text-sm">{g}</span>
                        </label>
                      ))}
                  </div>
              </div>
            </div>

            <hr className="border-stone-200" />

            <h2 className="font-bold text-lg text-stone-800">Preferences</h2>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                 {[
                   'Beach', 'Mountain', 'Community', 'Experience', 
                   'Adventure', 'Outdoor Sports', 'Foods', 
                   'Transportation', 'Events', 'For a Cause', 'Volunteer'
                 ].map(interest => (
                    <label key={interest} className="inline-flex items-center px-3 py-1.5 rounded-full border bg-white cursor-pointer hover:bg-emerald-50 hover:border-emerald-200">
                        <input type="checkbox" className="mr-2" /> <span className="text-sm">{interest}</span>
                    </label>
                 ))}
              </div>
            </div>

            <hr className="border-stone-200" />

            <h2 className="font-bold text-lg text-stone-800">Social Group / Accessibility</h2>
            <div>
               <p className="text-xs text-stone-500 mb-3">This helps us recommend places with the right facilities.</p>
               <div className="space-y-2">
                  {[
                    'Person with Disability (Needs access & assistance)',
                    'Elderly (Needs access & assistance)',
                    'Indigenous People (IP)',
                    'LGBTQIA+',
                    'None / Prefer not to say'
                  ].map((group, idx) => (
                     <label key={idx} className="flex items-start p-3 border rounded-xl bg-white">
                        <input type="radio" name="socialGroup" className="mt-1 mr-3" />
                        <span className="text-sm text-stone-700">{group}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-stone-700">
                <label className="flex items-start">
                   <input type="checkbox" className="mt-1 mr-3 h-5 w-5 text-emerald-600" />
                   <span>I read and agree to TaraGo's <span className="font-bold underline text-emerald-700">Terms, Conditions, Policy, and Data Privacy</span>.</span>
                </label>
            </div>
         </div>
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
         <button onClick={onComplete} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">
            Submit Registration
         </button>
      </div>
    </div>
  );
}

const Input: React.FC<{ label: string; placeholder?: string; type?: string }> = ({ label, placeholder, type = 'text' }) => (
  <div>
      <label className="block text-xs font-bold text-stone-600 uppercase mb-2">{label}</label>
      <input 
          type={type} 
          className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          placeholder={placeholder} 
      />
  </div>
);
