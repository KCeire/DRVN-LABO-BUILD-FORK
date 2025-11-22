'use client';

import { Button } from '../../components/ui/button';
import type { Game } from '../types';

interface FeaturedGameBannerProps {
  game: Game;
  onPlay: () => void;
}

export default function FeaturedGameBanner({ game, onPlay }: FeaturedGameBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 md:p-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
        <div className="text-9xl transform rotate-12">
          {game.icon}
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Featured Badge and Stats */}
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            ⭐ FEATURED GAME
          </span>
          <span className="text-white/80 text-sm font-mono">
            {game.plays} plays this week
          </span>
        </div>

        {/* Game Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-sans">
          {game.title}
        </h2>

        {/* Description */}
        <p className="text-white/90 text-lg mb-6 max-w-2xl font-sans leading-relaxed">
          {game.longDescription || game.description}
        </p>

        {/* Action Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Play Button */}
          <Button
            onClick={onPlay}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🎮 Play Now
          </Button>

          {/* Developer Credit */}
          {game.developer && (
            <div className="text-white/80 font-sans">
              <span className="text-sm">Created by </span>
              <span className="text-white font-semibold">{game.developer}</span>
            </div>
          )}

          {/* Category Badge */}
          <span className="bg-white/20 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            {game.category}
          </span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full" />
      <div className="absolute top-8 right-8 w-1 h-1 bg-white/20 rounded-full" />
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-white/20 rounded-full" />
    </div>
  );
}