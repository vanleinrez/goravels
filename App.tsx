import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import DiscoverScreen from './screens/DiscoverScreen';
import PlannerScreen from './screens/PlannerScreen';
import SosScreen from './screens/SosScreen';
import ConnectScreen from './screens/ConnectScreen';
import ProfileScreen from './screens/ProfileScreen';
import { OnboardingFlow, SignInScreen, SignUpScreen } from './screens/Onboarding';
import HostRegistrationScreen from './screens/HostRegistration';
import HostDashboardScreen from './screens/HostDashboardScreen';
import { mockUser } from './constants';

export type Screen = 'Explore' | 'Planner' | 'SOS' | 'Connect' | 'Profile';
export type AuthStep = 'splash' | 'welcome' | 'signin' | 'signup' | 'host-reg' | 'host-dashboard' | 'app';

const App: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('splash');
  const [activeScreen, setActiveScreen] = useState<Screen>('Explore');
  const [userRole, setUserRole] = useState<'traveler' | 'host'>('traveler');

  // Simulate Splash Screen timer
  useEffect(() => {
    if (authStep === 'splash') {
      const timer = setTimeout(() => {
        setAuthStep('welcome');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  const handleLogin = (role: 'traveler' | 'host') => {
    setUserRole(role);
    if (role === 'host') {
      setAuthStep('host-dashboard');
    } else {
      setAuthStep('app');
    }
  };

  const renderContent = () => {
    switch (authStep) {
      case 'splash':
      case 'welcome':
        return <OnboardingFlow step={authStep} setStep={setAuthStep} />;
      case 'signin':
        return <SignInScreen onBack={() => setAuthStep('welcome')} onLogin={handleLogin} />;
      case 'signup':
        return (
          <SignUpScreen 
            onBack={() => setAuthStep('welcome')} 
            onSignUpTraveler={() => handleLogin('traveler')}
            onSignUpHost={() => setAuthStep('host-reg')}
          />
        );
      case 'host-reg':
        return <HostRegistrationScreen onComplete={() => setAuthStep('host-dashboard')} />;
      case 'host-dashboard':
        return <HostDashboardScreen onLogout={() => setAuthStep('welcome')} />;
      case 'app':
        return (
          <>
            <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
              {activeScreen === 'Explore' && <DiscoverScreen user={mockUser} />}
              {activeScreen === 'Planner' && <PlannerScreen />}
              {activeScreen === 'SOS' && <SosScreen />}
              {activeScreen === 'Connect' && <ConnectScreen />}
              {activeScreen === 'Profile' && <ProfileScreen user={mockUser} />}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 antialiased text-gray-800 font-sans">
      <div className="max-w-md mx-auto h-screen bg-white flex flex-col shadow-2xl overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;