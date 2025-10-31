import React from 'react';

export const RoteiroIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M8 6h10"></path>
        <path d="M6 12h12"></path>
        <path d="M8 18h10"></path>
        <path d="M4 6h1"></path>
        <path d="M4 12h1"></path>
        <path d="M4 18h1"></path>
    </svg>
);
