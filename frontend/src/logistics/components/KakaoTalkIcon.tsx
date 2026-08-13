import React from 'react';

export const KakaoTalkIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Yellow background rounded square */}
    <rect width="100" height="100" rx="22" fill="#FEE500" />
    {/* Dark brown speech bubble with tail at bottom left */}
    <path
      d="M50 18C28.461 18 11 32.775 11 50.958C11 62.594 18.326 72.647 29.383 78.488L25.647 91.803C25.222 93.318 26.874 94.482 28.118 93.586L44.034 82.124C45.987 82.591 47.978 82.831 50 82.831C71.539 82.831 89 68.056 89 49.873C89 31.69 71.539 18 50 18Z"
      fill="#3C1E1E"
    />
    {/* TALK text inside speech bubble */}
    <text
      x="50"
      y="57"
      textAnchor="middle"
      fill="#FEE500"
      fontSize="23"
      fontWeight="900"
      fontFamily="sans-serif"
      letterSpacing="0.5"
    >
      TALK
    </text>
  </svg>
);
