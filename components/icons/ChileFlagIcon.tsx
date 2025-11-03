import React from 'react';

export const ChileFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 900 600"
        className={`w-6 h-auto ${className}`}
        aria-label="Bandeira do Chile"
    >
        <rect width="900" height="600" fill="#d52b1e"/>
        <rect width="900" height="300" fill="#fff"/>
        <rect width="300" height="300" fill="#0039a6"/>
        <polygon points="150,113.2 170.6,176.8 111.1,136.8 188.9,136.8 129.4,176.8" fill="#fff"/>
    </svg>
);
