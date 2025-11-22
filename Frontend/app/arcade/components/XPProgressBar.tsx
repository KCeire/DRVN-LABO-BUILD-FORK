'use client';

import { cn } from '../../../lib/utils';

interface XPProgressBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function XPProgressBar({
  currentXp,
  nextLevelXp,
  level,
  showLabel = false,
  size = 'md',
  className,
}: XPProgressBarProps) {
  const progress = Math.min((currentXp / nextLevelXp) * 100, 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between text-sm mb-1 font-mono">
          <span className="text-gray-300">
            {currentXp.toLocaleString()} XP
          </span>
          <span className="text-gray-400">
            {nextLevelXp.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        {/* Progress Fill */}
        <div
          className={cn(
            'h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out',
            'relative overflow-hidden'
          )}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
        </div>
      </div>

      {/* Progress Percentage (optional) */}
      {showLabel && size !== 'sm' && (
        <div className="text-center text-xs text-gray-500 mt-1 font-mono">
          {progress.toFixed(1)}% to Level {level + 1}
        </div>
      )}
    </div>
  );
}