import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'dark',
  onClick
}) => {
  // Height and font size mappings
  const iconDimensions = {
    sm: { width: 26, height: 23 },
    md: { width: 34, height: 30 },
    lg: { width: 44, height: 39 },
    xl: { width: 52, height: 46 },
  };

  const textClassMap = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
  };

  const { width, height } = iconDimensions[size];

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}
    >
      {/* High-Resolution Vector Speech Bubble (Matches exact Kakao MOHE logo image) */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transform transition-transform duration-200 group-hover:scale-105"
      >
        {/* Soft yellow speech bubble body */}
        <rect x="4" y="4" width="92" height="66" rx="26" fill="#FCE44D" />
        {/* Tail pointing down-left */}
        <path 
          d="M 22 65 L 10 84 L 38 68 Z" 
          fill="#FCE44D" 
          stroke="#FCE44D" 
          strokeWidth="3" 
          strokeLinejoin="round" 
        />
      </svg>

      {/* High-Definition Crisp Typography: Kakao MOHE */}
      <span
        className={`tracking-tight font-sans transition-colors ${textClassMap[size]} ${
          variant === 'light' ? 'text-white' : 'text-[#22252A]'
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
      >
        Kakao <span className="font-extrabold">MOHE</span>
      </span>
    </div>
  );
};
