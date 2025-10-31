import React from 'react';

export const PlaneTakeoffIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M2 22h20" />
        <path d="M6.36 17.41 19.33 4.44a2 2 0 0 1 2.23 2.23l-13 13a2 2 0 0 1-2.23-2.23Z" />
        <path d="m21.5 9.5-4.99-4.99" />
    </svg>
);