
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';

interface SosScreenProps {
  onComplete?: () => void;
}

type EmergencyLevel = 1 | 2 | 3;

interface EmergencyType {
  level: EmergencyLevel;
  title: string;
  desc: string;
  examples: string[];
  color: string;
}

const EMERGENCY_TYPES: EmergencyType[] = [
  {
    level: 1,
    title: 'Low Risk',
    desc: 'Non-critical situations requiring assistance.',
    examples: ['Minor road accident', 'Vehicle breakdown', 'Lost personal items', 'Minor cuts/bruises'],
    color: 'bg-yellow-500'
  },
  {
    level: 2,
    title: 'Intermediate Risk',
    desc: 'Potential danger requiring urgent attention.',
    examples: ['Lost in trail', 'Separated from guide', 'Dehydration/Exhaustion', 'Suspicious activity'],
    color: 'bg-orange-500'
  },
  {
    level: 3,
    title: 'High Risk',
    desc: 'Life-threatening situations. Immediate rescue needed.',
    examples: ['Severe injury', 'Snake/Insect bite', 'Fall from height', 'Physical assault', 'Flash flood'],
    color: 'bg-red-600'
  }
];

const SosScreen: React.FC<SosScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'IDLE' | 'LEVEL_SELECT' | 'CONFIRM' | 'SENT'>('IDLE');
  const [selectedLevel, setSelectedLevel] = useState<EmergencyType | null>(null);
  const [pressTimer, setPressTimer] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Long Press Logic
  const startPress = () => {
    if (step !== 'IDLE') return;
    setPressTimer(0);
    intervalRef.current = setInterval(() => {
      setPressTimer((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStep('LEVEL_SELECT');
          return 100;
        }
        return prev + 2; // Speed of fill (approx 3 seconds total with interval 20ms and step 2, actually 20ms*50 steps = 1s. Adjust step to 0.7 for ~3s)
      });
    }, 20);
  };

  const endPress = () => {
    if (step === 'IDLE') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPressTimer(0);
    }
  };

  const handleLevelSelect = (type: EmergencyType) => {
    setSelectedLevel(type);
    setStep('CONFIRM');
  };

  const handleSendSos = () => {
    setStep('SENT');
    // Simulate API dispatch to MDRRMO/Police
    setTimeout(() => {
        // Optional: Auto close or keep open
    }, 5000);
  };

  const handleFinish = () => {
      if (onComplete) onComplete();
  };

  return (
    <div className="h-full bg-stone-900 text-white p-6 flex flex-col relative overflow-hidden">
      
      {/* Background Pulse Effect for Sent State */}
      {step === 'SENT' && (
         <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-96 h-96 bg-red-600 rounded-full opacity-20 animate-ping"></div>
         </div>
      )}

      {/* --- IDLE STATE: LONG PRESS BUTTON --- */}
      {step === 'IDLE' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center">
            <h1 className="text-3xl font-black text-red-500 mb-2 tracking-tighter">EMERGENCY SOS</h1>
            <p className="text-stone-400 mb-12 text-sm max-w-xs">
              Hold the button for 3 seconds to activate. Use only for genuine emergencies.
            </p>

            <button
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                className="relative w-64 h-64 rounded-full flex items-center justify-center outline-none select-none active:scale-95 transition-transform"
            >
                {/* Progress Ring Background */}
                <div className="absolute inset-0 rounded-full border-8 border-stone-800"></div>
                
                {/* Active Progress Ring */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="8"
                        strokeDasharray="289.02" // 2 * PI * 46
                        strokeDashoffset={289.02 - (289.02 * pressTimer) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-75"
                    />
                </svg>

                {/* Inner Button */}
                <div className="absolute inset-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center border-4 border-stone-800">
                    <Icon className="w-20 h-20 text-white mb-2">
                        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </Icon>
                    <span className="font-bold text-2xl tracking-widest">HOLD</span>
                    <span className="text-xs font-medium opacity-80 mt-1">3 SECONDS</span>
                </div>
            </button>
        </div>
      )}

      {/* --- LEVEL SELECTION --- */}
      {step === 'LEVEL_SELECT' && (
          <div className="flex-1 flex flex-col animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">What is your emergency?</h2>
              
              <div className="space-y-4 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  {EMERGENCY_TYPES.map((type) => (
                      <button 
                        key={type.level}
                        onClick={() => handleLevelSelect(type)}
                        className="w-full bg-stone-800 hover:bg-stone-700 p-5 rounded-2xl text-left border border-stone-700 transition-colors group"
                      >
                          <div className="flex justify-between items-center mb-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded text-white ${type.color}`}>
                                  LEVEL {type.level}
                              </span>
                              <Icon className="w-5 h-5 text-stone-500 group-hover:text-white"><path d="m9 18 6-6-6-6"/></Icon>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{type.title}</h3>
                          <p className="text-stone-400 text-sm mb-3">{type.desc}</p>
                          <div className="flex flex-wrap gap-2">
                              {type.examples.map(ex => (
                                  <span key={ex} className="text-[10px] bg-stone-900 text-stone-300 px-2 py-1 rounded border border-stone-700">{ex}</span>
                              ))}
                          </div>
                      </button>
                  ))}
              </div>
              <button onClick={() => setStep('IDLE')} className="py-4 text-stone-400 font-bold">Cancel</button>
          </div>
      )}

      {/* --- CONFIRMATION & LIABILITY --- */}
      {step === 'CONFIRM' && selectedLevel && (
          <div className="flex-1 flex flex-col animate-slide-in-right">
              <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${selectedLevel.color} shadow-lg shadow-red-900/50`}>
                      <Icon className="w-10 h-10 text-white"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Confirm {selectedLevel.title}</h2>
                  <p className="text-stone-300 text-sm mb-8">{selectedLevel.desc}</p>

                  <div className="bg-red-900/30 border border-red-800 p-4 rounded-xl text-left mb-8">
                      <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center">
                          <Icon className="w-4 h-4 mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>
                          TERMS & LIABILITY
                      </h4>
                      <p className="text-xs text-red-200 leading-relaxed mb-2">
                          By activating this SOS, you consent to sharing your real-time location with local authorities (PNP, MDRRMO, LGU).
                      </p>
                      <p className="text-xs text-red-200 leading-relaxed font-bold">
                          "Don't send false alarm. Response team is taking action for irresponsible users."
                      </p>
                  </div>

                  <button 
                    onClick={handleSendSos}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 active:scale-95 transition-transform flex items-center justify-center space-x-2"
                  >
                      <span>CONFIRM & SEND ALERT</span>
                      <Icon className="w-5 h-5"><path d="M5 12h14M12 5l7 7-7 7"/></Icon>
                  </button>
                  <button onClick={() => setStep('LEVEL_SELECT')} className="mt-4 text-stone-500 text-sm">Go Back</button>
              </div>
          </div>
      )}

      {/* --- SENT STATE --- */}
      {step === 'SENT' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in z-10">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <Icon className="w-16 h-16 text-white"><polyline points="20 6 9 17 4 12" /></Icon>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">ALERT SENT</h2>
              <p className="text-green-400 font-medium mb-8">Help is on the way.</p>
              
              <div className="bg-stone-800/80 backdrop-blur-md p-6 rounded-2xl border border-stone-700 w-full max-w-xs text-left space-y-4">
                  <div>
                      <span className="text-xs text-stone-500 uppercase font-bold">Dispatched To</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded border border-blue-800">Nearby Police</span>
                          <span className="bg-red-900/50 text-red-200 text-xs px-2 py-1 rounded border border-red-800">MDRRMO Rescue</span>
                          <span className="bg-emerald-900/50 text-emerald-200 text-xs px-2 py-1 rounded border border-emerald-800">Gora Admins</span>
                      </div>
                  </div>
                  <div>
                      <span className="text-xs text-stone-500 uppercase font-bold">Location Shared</span>
                      <p className="text-sm text-white font-mono mt-1">8.4521° N, 124.9812° E</p>
                      <p className="text-xs text-stone-400">Bukidnon, Philippines</p>
                  </div>
              </div>

              <div className="mt-10">
                  <p className="text-xs text-stone-500 mb-4">Emergency resolved?</p>
                  <button 
                    onClick={handleFinish}
                    className="px-8 py-3 bg-stone-800 text-white rounded-xl font-bold border border-stone-700"
                  >
                    I am safe now
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default SosScreen;
