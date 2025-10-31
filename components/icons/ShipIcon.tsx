import React from 'react';

export const ShipIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M22 18H2a2.5 2.5 0 0 1 0-5h20a2.5 2.5 0 0 1 0 5Z"/>
        <path d="M12 13V2L5 13h7Z"/>
        <path d="M12 21v-3"/>
    </svg>
);