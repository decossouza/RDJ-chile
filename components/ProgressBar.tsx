import React from 'react';

interface ProgressBarProps {
  progress: number;
  quote: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, quote }) => {
  const progressPercentage = Math.round(progress);

  return (
    <div>
      <div className="relative h-4 w-full bg-gray-500/20 rounded-full overflow-hidden dark:bg-gray-700/50">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {progressPercentage}%
        </span>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2 italic dark:text-gray-400">
        {quote}
      </p>
    </div>
  );
};