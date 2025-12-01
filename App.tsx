
import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import DiscoverScreen from './screens/DiscoverScreen';
import PlannerScreen from './screens/PlannerScreen';
import ActivityScreen from './screens/ActivityScreen';
import ConnectScreen from './screens/ConnectScreen';
import ProfileScreen from './screens/ProfileScreen';
import RestrictedAccessModal from './components/RestrictedAccessModal';
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
import { mockUser, mockListings, mockTrips } from './constants';
import type { User, Trip, Notification } from './types';

export type Screen = 'Explore' | 'Planner' | 'Connect' | 'Profile';
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
  const [plannerTab, setPlannerTab] = useState<'MyTrip' | 'GroupChat'>('MyTrip'); // Manage Planner Tab
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [authContext, setAuthContext] = useState<'new' | 'existing'>('new');
  const [loginRole, setLoginRole] = useState<'Host' | 'Traveler' | null>(null);
  const [hostStatus, setHostStatus] = useState<'Pending' | 'Active'>('Active');
  
  // Registration Data
  const [tempMobile, setTempMobile] = useState('');

  // New state to track ongoing activity
  const [isTripActive, setIsTripActive] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  
  // New State for Global SOS
  const [isSosActive, setIsSosActive] = useState(false);

  // Restricted Access State
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);

  // Global Data State
  const [myTrips, setMyTrips] = useState<Trip[]>(mockTrips);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', type: 'general', title: 'Welcome!', message: 'Start your adventure with Gora.', time: 'Just now', read: false },
    { id: 'n2', type: 'voucher', title: 'Gift Voucher', message: 'You received a 10% discount on your first booking!', time: '1h ago', read: false }
  ]);

  const handleAddTrip = (trip: Trip) => {
    setMyTrips(prev => [trip, ...prev]);
  };

  const handleAddNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const handleMarkRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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
      name: tempMobile ? `Gora ${tempMobile}` : 'Gora Guest',
      nickname: 'Guest',
      tier: 'Guest',
      stamps: 0,
      avatarUrl: '', // Will use default based on logic
      gender: 'Prefer not to say',
      phone: tempMobile
    });
    setAuthStep('app');
  };

  const handleTravelerRegComplete = (data: any) => {
    // Capture user details from registration form
    const updatedUser: User = {
        ...mockUser,
        name: data.fullName || 'Traveler',
        nickname: data.nickname || data.fullName?.split(' ')[0] || 'Traveler',
        tier: 'Explorer',
        location: data.province || mockUser.location,
        preferences: data.interests || mockUser.preferences,
        gender: data.gender,
        phone: tempMobile // Persist mobile
    };
    setCurrentUser(updatedUser); 
    setAuthStep('app');
  };

  const handleHostRegComplete = (data: any) => {
    // Capture host details from registration form
    const hostUser: User = {
        ...mockUser,
        name: `${data.firstName} ${data.familyName}`,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        location: data.address,
        isHost: true,
        gender: data.gender,
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
    };
    setCurrentUser(hostUser);
    setHostStatus('Pending');
    setAuthStep('host-dashboard');
  };

  const triggerRegistration = () => {
    // Legacy support: if called directly
    setAuthStep('traveler-reg');
    setShowRestrictedModal(false);
  };

  const handleRestrictedTrigger = () => {
    setShowRestrictedModal(true);
  };

  const handleBackToOnboarding = () => {
    setShowRestrictedModal(false);
    setAuthStep('welcome');
    setActiveScreen('Explore');
    setCurrentUser(mockUser); // Reset to default state
    setTempMobile('');
  };

  const handleSwitchToTraveler = () => {
    setCurrentUser(prev => ({...prev, isHost: true})); // Keep host status
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
    setIsSosActive(false);
    setTempMobile('');
  };

  const toggleTripStatus = () => setIsTripActive(!isTripActive);

  // Toggle Activity Overlay
  const handleGoClick = () => {
      // Restrict SOS/Activity for Guest Users
      if (currentUser.tier === 'Guest') {
          setShowRestrictedModal(true);
          return;
      }
      setIsActivityOpen(true);
  };

  // Intercept Navigation
  const handleNavigation = (screen: Screen) => {
    // Restrict Planner for Guest Users
    if (screen === 'Planner' && currentUser.tier === 'Guest') {
      setShowRestrictedModal(true);
      return;
    }
    // Allow Profile (it will show restricted/upsell view)
    setActiveScreen(screen);
  };

  const handleMessageHost = () => {
    if (currentUser.tier === 'Guest') {
      setShowRestrictedModal(true);
      return;
    }
    setActiveScreen('Planner');
    setPlannerTab('GroupChat');
  };

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
            onNext={(mobile) => { setTempMobile(mobile); setAuthStep('otp'); }} 
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
        return <TravelerRegistrationScreen onComplete={handleTravelerRegComplete} onBack={() => setAuthStep('role-selection')} />;
      case 'host-reg':
        return <HostRegistrationScreen onComplete={handleHostRegComplete} onBack={() => setAuthStep('role-selection')} />;
      case 'host-dashboard':
        return (
          <HostDashboardScreen 
            user={currentUser}
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
            <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide bg-stone-50 relative">
              {/* Activity Overlay Screen */}
              {isActivityOpen && (
                <ActivityScreen 
                    activeTrip={mockListings[0]} 
                    onClose={() => setIsActivityOpen(false)} 
                    isSosActive={isSosActive}
                    onSosStateChange={setIsSosActive}
                />
              )}

              {/* Restricted Access Modal */}
              {showRestrictedModal && (
                <RestrictedAccessModal 
                  onBackToOnboarding={handleBackToOnboarding}
                  onCancel={() => setShowRestrictedModal(false)}
                />
              )}

              {activeScreen === 'Explore' && (
                <DiscoverScreen 
                  user={currentUser} 
                  onRegister={handleRestrictedTrigger} 
                  onAddTrip={handleAddTrip}
                  onAddNotification={handleAddNotification}
                  onProfileClick={() => setActiveScreen('Profile')}
                  onMessageHost={handleMessageHost}
                />
              )}
              {activeScreen === 'Planner' && (
                <PlannerScreen 
                  isTripActive={isTripActive} 
                  onToggleTrip={toggleTripStatus}
                  myTrips={myTrips}
                  onAddTrip={handleAddTrip}
                  activeTab={plannerTab}
                  onTabChange={setPlannerTab}
                />
              )}
              {activeScreen === 'Connect' && (
                <ConnectScreen 
                  user={currentUser}
                  onRestricted={handleRestrictedTrigger}
                />
              )}
              {activeScreen === 'Profile' && (
                <ProfileScreen 
                  user={currentUser} 
                  onLogout={handleLogout}
                  onSwitchToHost={handleSwitchToHost}
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onCompleteRegistration={triggerRegistration}
                />
              )}
            </main>
            <BottomNav 
              activeScreen={activeScreen} 
              setActiveScreen={handleNavigation} 
              isTripActive={isTripActive}
              isSosActive={isSosActive}
              onGoClick={handleGoClick}
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
