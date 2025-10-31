import React from 'react';

export const CableCarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <rect width="16" height="16" x="4" y="3" rx="2"/>
        <path d="M4 11h16"/>
        <path d="M12 3v8"/>
        <path d="M8 19h1"/>
        <path d="M15 19h1"/>
        <path d="M12 19a2.5 2.5 0 0 0-2.5-2.5V15h5v1.5A2.5 2.5 0 0 0 12 19Z"/>
    </svg>
);