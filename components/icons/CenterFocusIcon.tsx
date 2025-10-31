import React from 'react';

export const CenterFocusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.657-3.657l-1.414 1.414M6.757 17.243l-1.414-1.414m12.728 0l-1.414-1.414M6.757 6.757l-1.414 1.414" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" />
    </svg>
);
