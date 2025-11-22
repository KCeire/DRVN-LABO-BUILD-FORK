'use client';

import { useState } from 'react';
import { Search, Bookmark, BookmarkCheck, Gamepad2 } from 'lucide-react';
import GameGrid from '../components/GameGrid';
import GameInfoModal from '../components/GameInfoModal';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { Game, GameCategory } from '../types';

// Placeholder games data (same as dashboard)
const PLACEHOLDER_GAMES: Game[] = [
  {
    id: '1',
    title: 'F1 Race Predictor',
    icon: '🏁',
    description: 'Predict race winners and podium finishes',
    longDescription: 'Test your F1 knowledge by predicting race outcomes. Earn XP and BSTR rewards for accurate predictions! Use real-time telemetry data to make informed decisions.',
    plays: '1.2K',
    category: 'Prediction',
    featured: true,
    developer: 'DRVN Labs',
    releasedAt: '2024-11-01',
  },
  {
    id: '2',
    title: 'Reaction Challenge',
    icon: '⚡',
    description: 'Test your lightning-fast reflexes',
    longDescription: 'How fast are your reflexes? Test your reaction time with this addictive skill game. Compete for the fastest times on the global leaderboard.',
    plays: '850',
    category: 'Skill',
    developer: 'Speed Labs',
    releasedAt: '2024-10-15',
  },
  {
    id: '3',
    title: 'Tuner Shop Tycoon',
    icon: '🔧',
    description: 'Build and manage your dream garage',
    longDescription: 'Start with a small garage and build your tuning empire. Buy, modify, and sell cars while managing your reputation and resources.',
    plays: '2.1K',
    category: 'Strategy',
    featured: true,
    developer: 'Tingz Labs',
    releasedAt: '2024-09-20',
  },
  {
    id: '4',
    title: 'Pit Stop Challenge',
    icon: '🏎️',
    description: 'Complete pit stops as fast as possible',
    longDescription: 'Master the art of the perfect pit stop. Time your crew perfectly to change tires and refuel in record time.',
    plays: '645',
    category: 'Skill',
    developer: 'Race Team Studios',
    releasedAt: '2024-10-01',
  },
  {
    id: '5',
    title: 'Track Master',
    icon: '🏆',
    description: 'Learn famous racing circuits',
    longDescription: 'Test your knowledge of world-famous racing circuits. Learn track layouts, corners, and racing lines through interactive challenges.',
    plays: '423',
    category: 'Puzzle',
    developer: 'Circuit Games',
    releasedAt: '2024-11-10',
  },
  {
    id: '6',
    title: 'Drift King',
    icon: '💨',
    description: 'Master the art of drifting',
    longDescription: 'Perfect your drifting technique on mountain passes and city streets. Chain combos and maintain perfect angles for maximum points.',
    plays: '891',
    category: 'Racing',
    developer: 'Drift Studio',
    releasedAt: '2024-08-15',
  },
  {
    id: '7',
    title: 'Engine Builder',
    icon: '🔩',
    description: 'Assemble high-performance engines',
    longDescription: 'Build engines from scratch, optimizing for power, efficiency, and reliability. Learn about real engine components and tuning.',
    plays: '567',
    category: 'Strategy',
    developer: 'Mechanic Minds',
    releasedAt: '2024-09-05',
  },
  {
    id: '8',
    title: 'Checkpoint Rush',
    icon: '🎯',
    description: 'Race against time through checkpoints',
    longDescription: 'Navigate through challenging checkpoint courses. Test your precision driving and time management skills.',
    plays: '734',
    category: 'Racing',
    developer: 'Rush Games',
    releasedAt: '2024-10-20',
  },
];

const GAME_CATEGORIES: (GameCategory | 'All')[] = [
  'All',
  'Prediction',
  'Skill',
  'Strategy',
  'Racing',
  'Puzzle',
];

export default function GamesPage() {
  // State
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'All'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Use shared bookmark context
  const { bookmarkedGames, toggleBookmark, isBookmarked } = useBookmarks();

  // Handlers
  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };


  const handleGameLaunch = (gameId: string) => {
    console.log('Launching game:', gameId);
    alert(`Game ${gameId} would launch here! 🎮`);
  };

  // Filtered games
  const filteredGames = PLACEHOLDER_GAMES.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesBookmark = !showBookmarkedOnly || isBookmarked(game.id);

    return matchesSearch && matchesCategory && matchesBookmark;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00daa2] to-[#0066ff] rounded-full flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-mono">All Games</h1>
        <p className="text-gray-400">
          Discover and bookmark your favorite games from our collection
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00daa2]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {GAME_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#00daa2] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Bookmark Filter */}
        <button
          onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showBookmarkedOnly
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {showBookmarkedOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {showBookmarkedOnly ? 'Bookmarked' : 'All'}
        </button>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing {filteredGames.length} of {PLACEHOLDER_GAMES.length} games
          {bookmarkedGames.size > 0 && (
            <span className="ml-2">
              • {bookmarkedGames.size} bookmarked
            </span>
          )}
        </p>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <GameGrid
          games={filteredGames}
          bookmarkedGames={bookmarkedGames}
          onGameClick={handleGameClick}
          onBookmarkToggle={toggleBookmark}
        />
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No games found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Game Info Modal */}
      <GameInfoModal
        game={selectedGame}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLaunch={handleGameLaunch}
        onBookmarkToggle={toggleBookmark}
        bookmarked={selectedGame ? isBookmarked(selectedGame.id) : false}
      />

      {/* Bottom Spacing for Mobile Navigation */}
      <div className="h-20 md:h-8" />
    </div>
  );
}