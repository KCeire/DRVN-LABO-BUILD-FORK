'use client';

import { Lock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
  showDetails?: boolean;
  className?: string;
}

export default function AchievementBadge({
  achievement,
  onClick,
  showDetails = false,
  className,
}: AchievementBadgeProps) {
  const getRarityColors = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const rarityGradient = getRarityColors(achievement.rarity);

  return (
    <div
      className={cn(
        'relative rounded-lg p-4 text-center cursor-pointer transition-all duration-300 transform hover:scale-105',
        achievement.unlocked
          ? `bg-gradient-to-br ${rarityGradient} shadow-lg hover:shadow-xl`
          : 'bg-gray-300 dark:bg-gray-700 opacity-60 hover:opacity-80',
        'border-2',
        achievement.unlocked
          ? 'border-white/20'
          : 'border-gray-400 dark:border-gray-600',
        className
      )}
      onClick={onClick}
    >
      {/* Lock overlay for locked achievements */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <Lock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </div>
      )}

      {/* Achievement Icon */}
      <div
        className={cn(
          'text-4xl mb-2 transition-all duration-300',
          !achievement.unlocked && 'filter grayscale'
        )}
      >
        {achievement.icon}
      </div>

      {/* Achievement Title */}
      <h4
        className={cn(
          'font-semibold text-sm mb-1 font-sans',
          achievement.unlocked
            ? 'text-white'
            : 'text-gray-600 dark:text-gray-400'
        )}
      >
        {achievement.title}
      </h4>

      {/* Rarity indicator */}
      {achievement.unlocked && achievement.rarity && (
        <div className="mb-2">
          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full bg-black/20 text-white font-medium uppercase tracking-wide'
            )}
          >
            {achievement.rarity}
          </span>
        </div>
      )}

      {/* Unlock date or requirement */}
      <div className="text-xs">
        {achievement.unlocked && achievement.unlockedAt ? (
          <p className="text-white/80">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        ) : achievement.requirement ? (
          <p className="text-gray-600 dark:text-gray-400 font-mono">
            {achievement.requirement}
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Achievement locked
          </p>
        )}
      </div>

      {/* XP Reward (if available and unlocked) */}
      {achievement.unlocked && achievement.xpReward && showDetails && (
        <div className="mt-2 text-xs text-white/90 font-mono">
          +{achievement.xpReward} XP
        </div>
      )}

      {/* Hover shimmer effect for unlocked achievements */}
      {achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
      )}

      {/* Glow effect for legendary achievements */}
      {achievement.unlocked && achievement.rarity === 'legendary' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-30 animate-pulse" />
      )}
    </div>
  );
}