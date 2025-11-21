import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import DiscoverScreen from './screens/DiscoverScreen';
import PlannerScreen from './screens/PlannerScreen';
import SosScreen from './screens/SosScreen';
import ConnectScreen from './screens/ConnectScreen';
import ProfileScreen from './screens/ProfileScreen';
import { mockUser } from './constants';

export type Screen = 'Explore' | 'Planner' | 'SOS' | 'Connect' | 'Profile';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Explore');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Explore':
        return <DiscoverScreen user={mockUser} />;
      case 'Planner':
        return <PlannerScreen />;
      case 'SOS':
        return <SosScreen />;
      case 'Connect':
        return <ConnectScreen />;
      case 'Profile':
        return <ProfileScreen user={mockUser} />;
      default:
        return <DiscoverScreen user={mockUser} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 antialiased text-gray-800 font-sans">
      <div className="max-w-md mx-auto h-screen bg-white flex flex-col shadow-2xl overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {renderScreen()}
        </main>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </div>
  );
};

export default App;