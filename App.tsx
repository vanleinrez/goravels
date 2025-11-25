
import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import DiscoverScreen from './screens/DiscoverScreen';
import PlannerScreen from './screens/PlannerScreen';
import SosScreen from './screens/SosScreen';
import ConnectScreen from './screens/ConnectScreen';
import ProfileScreen from './screens/ProfileScreen';
import { 
  OnboardingFlow, 
  MobileEntryScreen, 
  OTPScreen, 
  LoginRoleSelectionScreen,
  RoleSelectionScreen, 
  TravelerRegistrationScreen 
} from './screens/Onboarding';
import HostRegistrationScreen from './screens/HostRegistration';
import HostDashboardScreen from './screens/HostDashboardScreen';
import { mockUser } from './constants';
import type { User } from './types';

export type Screen = 'Explore' | 'Planner' | 'SOS' | 'Connect' | 'Profile';
export type AuthStep = 
  | 'splash' 
  | 'welcome' 
  | 'login-role-selection'
  | 'mobile-entry' 
  | 'otp' 
  | 'role-selection' 
  | 'traveler-reg' 
  | 'host-reg' 
  | 'host-dashboard' 
  | 'app';

const App: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('splash');
  const [activeScreen, setActiveScreen] = useState<Screen>('Explore');
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [authContext, setAuthContext] = useState<'new' | 'existing'>('new');
  const [loginRole, setLoginRole] = useState<'Host' | 'Traveler' | null>(null);
  const [hostStatus, setHostStatus] = useState<'Pending' | 'Active'>('Active');
  
  // New state to track ongoing activity
  const [isTripActive, setIsTripActive] = useState(false);

  // Simulate Splash Screen timer
  useEffect(() => {
    if (authStep === 'splash') {
      const timer = setTimeout(() => {
        setAuthStep('welcome');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  // Handle flow after OTP is verified
  const handleOTPVerified = () => {
    if (authContext === 'existing') {
      // Login Flow
      if (loginRole === 'Host') {
        setHostStatus('Active'); // Assuming active for returning host
        setAuthStep('host-dashboard');
      } else {
        // Traveler
        setCurrentUser(mockUser);
        setAuthStep('app');
      }
    } else {
      // New User Flow
      setAuthStep('role-selection');
    }
  };

  const handleGuestAccess = () => {
    setCurrentUser({
      ...mockUser,
      name: 'Guest Traveler',
      tier: 'Guest',
      stamps: 0
    });
    setAuthStep('app');
  };

  const handleTravelerRegComplete = () => {
    setCurrentUser(mockUser); // Set to a logged in user
    setAuthStep('app');
  };

  const handleHostRegComplete = () => {
    setHostStatus('Pending');
    setAuthStep('host-dashboard');
  };

  const triggerRegistration = () => {
    setAuthStep('traveler-reg');
  };

  const handleSwitchToTraveler = () => {
    setCurrentUser(mockUser);
    setActiveScreen('Explore');
    setAuthStep('app');
  };

  const handleSwitchToHost = () => {
    setLoginRole('Host');
    setAuthStep('host-dashboard');
  };

  const handleLogout = () => {
    setAuthStep('welcome');
    setLoginRole(null);
    setAuthContext('existing');
  };

  const toggleTripStatus = () => setIsTripActive(!isTripActive);

  const renderContent = () => {
    switch (authStep) {
      case 'splash':
      case 'welcome':
        return (
          <OnboardingFlow 
            step={authStep} 
            setStep={setAuthStep} 
            setContext={setAuthContext} 
          />
        );
      case 'login-role-selection':
        return (
          <LoginRoleSelectionScreen
            onBack={() => setAuthStep('welcome')}
            onSelectHost={() => { setLoginRole('Host'); setAuthStep('mobile-entry'); }}
            onSelectTraveler={() => { setLoginRole('Traveler'); setAuthStep('mobile-entry'); }}
          />
        );
      case 'mobile-entry':
        return (
          <MobileEntryScreen 
            onBack={() => authContext === 'existing' ? setAuthStep('login-role-selection') : setAuthStep('welcome')} 
            onNext={() => setAuthStep('otp')} 
          />
        );
      case 'otp':
        return (
          <OTPScreen 
            onBack={() => setAuthStep('mobile-entry')} 
            onVerify={handleOTPVerified} 
          />
        );
      case 'role-selection':
        return (
          <RoleSelectionScreen 
            onBack={() => setAuthStep('welcome')}
            onSelectTraveler={() => setAuthStep('traveler-reg')}
            onSelectHost={() => setAuthStep('host-reg')}
            onSkip={handleGuestAccess}
          />
        );
      case 'traveler-reg':
        return <TravelerRegistrationScreen onComplete={handleTravelerRegComplete} />;
      case 'host-reg':
        return <HostRegistrationScreen onComplete={handleHostRegComplete} />;
      case 'host-dashboard':
        return (
          <HostDashboardScreen 
            status={hostStatus} 
            onLogout={handleLogout} 
            onSwitchToTraveler={handleSwitchToTraveler}
            isTripActive={isTripActive}
            onToggleTrip={toggleTripStatus}
          />
        );
      case 'app':
        return (
          <>
            <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide bg-stone-50">
              {activeScreen === 'Explore' && (
                <DiscoverScreen 
                  user={currentUser} 
                  onRegister={triggerRegistration} 
                />
              )}
              {activeScreen === 'Planner' && (
                <PlannerScreen 
                  isTripActive={isTripActive} 
                  onToggleTrip={toggleTripStatus} 
                />
              )}
              {activeScreen === 'SOS' && (
                <SosScreen 
                  onComplete={() => {
                    setIsTripActive(false); 
                    setActiveScreen('Explore');
                  }} 
                />
              )}
              {activeScreen === 'Connect' && <ConnectScreen />}
              {activeScreen === 'Profile' && (
                <ProfileScreen 
                  user={currentUser} 
                  onLogout={handleLogout}
                  onSwitchToHost={handleSwitchToHost}
                />
              )}
            </main>
            <BottomNav 
              activeScreen={activeScreen} 
              setActiveScreen={setActiveScreen} 
              isTripActive={isTripActive}
            />
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
