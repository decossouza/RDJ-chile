import React from 'react';

export const PawPrintIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <circle cx="11" cy="4" r="2"></circle>
        <circle cx="18" cy="8" r="2"></circle>
        <circle cx="20" cy="16" r="2"></circle>
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-7 0V15a5 5 0 0 1 5-5z"></path>
        <path d="M6 14.32V15a3 3 0 0 0 3 3v-1.5a1.5 1.5 0 0 1-3 0z"></path>
    </svg>
);