import React from 'react';

export const BedIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M2 3v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V3"></path>
        <path d="M2 12h20"></path>
        <path d="M5 12v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"></path>
    </svg>
);
