
import React from 'react';

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/e7909117-d6bf-4712-a6f5-696a1e342bf7.png" 
        alt="HV Farm Logo" 
        className="h-10 w-auto"
      />
      <span className="ml-2 font-semibold text-lg text-farm-green dark:text-farm-beige">
        Cuenta Clara
      </span>
    </div>
  );
};

export default AppLogo;
