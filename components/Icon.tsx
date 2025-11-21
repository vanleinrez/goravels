
import React from 'react';

interface IconProps {
  className?: string;
  children: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({ className = 'w-6 h-6', children }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
};

export default Icon;
