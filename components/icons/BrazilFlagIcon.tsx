import React from 'react';

export const BrazilFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 700"
        className={`w-6 h-auto ${className}`}
        aria-label="Bandeira do Brasil"
    >
        <rect width="1000" height="700" fill="#009c3b"/>
        <path d="M500,85 L145,350 L500,615 L855,350 L500,85 Z" fill="#ffdf00"/>
        <circle cx="500" cy="350" r="175" fill="#002776"/>
    </svg>
);
