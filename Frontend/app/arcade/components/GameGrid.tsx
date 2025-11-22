'use client';

import GameCard from './GameCard';
import type { Game } from '../types';

interface GameGridProps {
  games: Game[];
  bookmarkedGames: Set<string>;
  onGameClick: (game: Game) => void;
  onBookmarkToggle: (gameId: string) => void;
  className?: string;
}

export default function GameGrid({
  games,
  bookmarkedGames,
  onGameClick,
  onBookmarkToggle,
  className = '',
}: GameGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          bookmarked={bookmarkedGames.has(game.id)}
          onClick={() => onGameClick(game)}
          onBookmarkToggle={() => onBookmarkToggle(game.id)}
        />
      ))}
    </div>
  );
}