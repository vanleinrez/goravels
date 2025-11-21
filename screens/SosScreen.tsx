import React, { useState } from 'react';
import Icon from '../components/Icon';

const SosScreen: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'COUNTDOWN' | 'SENT'>('IDLE');
  const [countdown, setCountdown] = useState(3);

  const handlePanic = () => {
    if (status === 'IDLE') {
      setStatus('COUNTDOWN');
      let count = 3;
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          setStatus('SENT');
        }
      }, 1000);
    }
  };

  const handleCancel = () => {
    setStatus('IDLE');
    setCountdown(3);
  };

  return (
    <div className="h-full bg-stone-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pulse Effect */}
      {status !== 'IDLE' && (
         <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-64 h-64 bg-red-600 rounded-full opacity-20 animate-ping"></div>
         </div>
      )}

      <div className="z-10 w-full max-w-xs text-center">
        <h1 className="text-3xl font-bold mb-2 text-red-500">EMERGENCY SOS</h1>
        <p className="text-stone-400 mb-10 text-sm">
          This will notify nearby travelers (5km) and the nearest LGU/Police station.
        </p>

        {status === 'IDLE' && (
            <button 
                onClick={handlePanic}
                className="w-48 h-48 rounded-full bg-gradient-to-b from-red-600 to-red-800 shadow-[0_0_30px_rgba(220,38,38,0.6)] border-4 border-red-500 flex flex-col items-center justify-center active:scale-95 transition-transform mx-auto"
            >
                <Icon className="w-16 h-16 text-white mb-2">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </Icon>
                <span className="font-bold text-xl tracking-widest">PRESS</span>
            </button>
        )}

        {status === 'COUNTDOWN' && (
            <div className="w-48 h-48 rounded-full bg-red-600 flex items-center justify-center mx-auto animate-pulse">
                <span className="text-6xl font-black">{countdown}</span>
            </div>
        )}

        {status === 'SENT' && (
             <div className="w-48 h-48 rounded-full bg-green-600 flex flex-col items-center justify-center mx-auto">
                <Icon className="w-16 h-16 mb-2"><polyline points="20 6 9 17 4 12" /></Icon>
                <span className="font-bold">SENT</span>
            </div>
        )}

        <div className="mt-12">
            {status === 'COUNTDOWN' ? (
                <button onClick={handleCancel} className="text-sm font-bold underline text-white">CANCEL</button>
            ) : status === 'SENT' ? (
                <div className="space-y-2">
                     <p className="text-sm text-green-400">Help is on the way.</p>
                     <button onClick={handleCancel} className="bg-stone-800 px-4 py-2 rounded-lg text-xs">Reset</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-800 p-3 rounded-lg flex flex-col items-center">
                         <Icon className="w-6 h-6 text-blue-400 mb-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>
                         <span className="text-xs font-medium">Police</span>
                    </div>
                    <div className="bg-stone-800 p-3 rounded-lg flex flex-col items-center">
                         <Icon className="w-6 h-6 text-white mb-1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></Icon>
                         <span className="text-xs font-medium">Medical</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SosScreen;