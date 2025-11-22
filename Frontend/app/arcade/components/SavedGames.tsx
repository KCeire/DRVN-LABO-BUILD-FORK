'use client';

import GameCard from './GameCard';
import type { Game } from '../types';

interface SavedGamesProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  className?: string;
}

export default function SavedGames({ games, onGameClick, className = '' }: SavedGamesProps) {
  if (games.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-4">
          <span className="text-4xl">📚</span>
        </div>
        <p className="text-gray-500 font-sans">No saved games yet</p>
        <p className="text-sm text-gray-600 font-sans">
          Bookmark games by clicking the star icon
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto pb-4 ${className}`}>
      <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <div key={game.id} className="flex-shrink-0 w-48 md:w-auto">
            <GameCard
              game={game}
              variant="mini"
              bookmarked={true}
              onClick={() => onGameClick(game)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}