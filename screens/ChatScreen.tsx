
import React from 'react';
import Icon from '../components/Icon';

const ChatScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="p-4 bg-blue-100 rounded-full mb-4">
        <Icon className="w-12 h-12 text-blue-600">
           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Icon>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      <p className="mt-2 text-gray-500">Your conversations with hosts will be stored here.</p>
    </div>
  );
};

export default ChatScreen;
