'use client';

import { X, Star, Play, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { cn } from '../../../lib/utils';
import type { Game } from '../types';

interface GameInfoModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch?: (gameId: string) => void;
  onBookmarkToggle?: (gameId: string) => void;
  bookmarked?: boolean;
}

export default function GameInfoModal({
  game,
  isOpen,
  onClose,
  onLaunch,
  onBookmarkToggle,
  bookmarked = false,
}: GameInfoModalProps) {
  if (!isOpen || !game) return null;

  const handleLaunch = () => {
    onLaunch?.(game.id);
  };

  const handleBookmarkToggle = () => {
    onBookmarkToggle?.(game.id);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Card className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-700 relative overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader className="pb-4">
          {/* Game Icon and Title Section */}
          <div className="flex items-start gap-6">
            {/* Large Game Icon */}
            <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
              {game.icon}
            </div>

            {/* Title and Developer Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-white mb-2 font-sans">
                {game.title}
              </h2>
              {game.developer && (
                <p className="text-gray-400 text-lg mb-2">
                  by <span className="text-[#00daa2]">{game.developer}</span>
                </p>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    // Category color coding
                    game.category === 'Prediction' && 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
                    game.category === 'Skill' && 'bg-green-900/30 text-green-400 border border-green-500/30',
                    game.category === 'Strategy' && 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
                    game.category === 'Racing' && 'bg-red-900/30 text-red-400 border border-red-500/30',
                    game.category === 'Puzzle' && 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30',
                    game.category === 'Social' && 'bg-pink-900/30 text-pink-400 border border-pink-500/30'
                  )}
                >
                  {game.category}
                </span>
                {game.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm font-bold rounded-full">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-300 text-lg leading-relaxed font-sans">
              {game.longDescription || game.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 py-4 border-t border-b border-gray-700">
            <div className="text-center">
              <p className="text-3xl font-bold text-white font-mono">
                {game.plays}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Plays</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-500 font-mono">-</p>
              <p className="text-sm text-gray-500 mt-1">Your Best</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00daa2] font-mono">25 XP</p>
              <p className="text-sm text-gray-500 mt-1">Avg. XP</p>
            </div>
          </div>

          {/* Screenshots placeholder */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Screenshots</h3>
              <div className="grid grid-cols-3 gap-3">
                {game.screenshots.slice(0, 3).map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs"
                  >
                    Screenshot {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleLaunch}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Game
            </Button>

            <Button
              onClick={handleBookmarkToggle}
              variant="outline"
              className={cn(
                'px-6 py-3 rounded-lg transition-all duration-200 border-2',
                bookmarked
                  ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 hover:bg-yellow-500/20'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
              )}
            >
              <Star
                className={cn(
                  'w-5 h-5',
                  bookmarked ? 'fill-current' : ''
                )}
              />
            </Button>

            {/* External link placeholder */}
            <Button
              variant="outline"
              size="icon"
              className="px-3 py-3 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white"
              title="View Details"
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
          </div>

          {/* Release Date */}
          {game.releasedAt && (
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-800">
              Released {new Date(game.releasedAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}