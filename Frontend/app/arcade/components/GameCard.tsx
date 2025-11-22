'use client';

import { Star } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  variant?: 'default' | 'mini';
  bookmarked?: boolean;
  onClick?: () => void;
  onBookmarkToggle?: () => void;
  className?: string;
}

export default function GameCard({
  game,
  variant = 'default',
  bookmarked = false,
  onClick,
  onBookmarkToggle,
  className,
}: GameCardProps) {
  const handleCardClick = () => {
    onClick?.();
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle?.();
  };

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-transform hover:scale-105',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Featured badge (top-right) */}
      {game.featured && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Bookmark button (top-left) */}
      <button
        className="absolute top-2 left-2 z-10 p-1.5 bg-black/70 hover:bg-black/90 rounded-full transition-colors"
        onClick={handleBookmarkClick}
      >
        <Star
          className={cn(
            'w-4 h-4 transition-colors',
            bookmarked
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-400 hover:text-yellow-400'
          )}
        />
      </button>

      {/* Card Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-4 transition-all duration-200 border border-gray-200 dark:border-gray-700">
        {/* Game Icon */}
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center text-4xl bg-gray-100 dark:bg-gray-700 rounded-lg">
          {game.icon}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-center mb-2 line-clamp-1 font-sans text-gray-900 dark:text-white">
          {game.title}
        </h3>

        {/* Description (only in default variant) */}
        {variant === 'default' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3 line-clamp-2 font-sans min-h-[2.5rem]">
            {game.description}
          </p>
        )}

        {/* Footer: plays + category */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-mono">{game.plays} plays</span>
          <span
            className={cn(
              'px-2 py-1 rounded-full font-medium',
              // Color coding by category
              game.category === 'Prediction' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
              game.category === 'Skill' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
              game.category === 'Strategy' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
              game.category === 'Racing' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
              game.category === 'Puzzle' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
              game.category === 'Social' && 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
            )}
          >
            {game.category}
          </span>
        </div>

        {/* Developer (if available and variant is default) */}
        {variant === 'default' && game.developer && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            by {game.developer}
          </div>
        )}
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
    </div>
  );
}