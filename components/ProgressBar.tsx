import React from 'react';

interface ProgressBarProps {
  progress: number;
  quote: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, quote }) => {
  const progressPercentage = Math.round(progress);

  return (
    <div className="w-full">
      <div className="relative h-4 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary-500/30 pulsing-glow"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
          {progressPercentage}%
        </span>
      </div>
      <p className="text-center text-xs text-slate-600 mt-2 italic dark:text-slate-400">
        {quote}
      </p>
    </div>
  );
};