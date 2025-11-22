'use client';

import { useState } from 'react';
import { Bookmark, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PlayerStatsWidget from '../components/PlayerStatsWidget';
import FeaturedGameBanner from '../components/FeaturedGameBanner';
import SavedGames from '../components/SavedGames';
import GameInfoModal from '../components/GameInfoModal';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { PlayerStats, Game } from '../types';

// Placeholder Data
const PLACEHOLDER_STATS: PlayerStats = {
  xp: 2450,
  level: 12,
  nextLevelXp: 3000,
  totalXpEarned: 12450,
  totalAchievements: 15,
  unlockedAchievements: 8,
};

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


export default function ArcadeDashboardPage() {
  // State
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Use shared bookmark context
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // Handlers
  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleGameLaunch = (gameId: string) => {
    // Placeholder - in real implementation this would launch the game
    console.log('Launching game:', gameId);
    alert(`Game ${gameId} would launch here! 🎮`);
  };

  // Derived data
  const savedGamesList = PLACEHOLDER_GAMES.filter((g) => isBookmarked(g.id));
  const featuredGame = PLACEHOLDER_GAMES.find((g) => g.featured);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Player Stats Widget */}
      <PlayerStatsWidget
        stats={PLACEHOLDER_STATS}
      />

      {/* Featured Game Banner */}
      {featuredGame && (
        <section>
          <FeaturedGameBanner
            game={featuredGame}
            onPlay={() => handleGameClick(featuredGame)}
          />
        </section>
      )}

      {/* Saved Games Section */}
      {savedGamesList.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white font-sans">
            <Bookmark className="w-6 h-6 text-[#00daa2]" />
            Saved Games
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({savedGamesList.length})
            </span>
          </h2>
          <SavedGames games={savedGamesList} onGameClick={handleGameClick} />
        </section>
      )}

      {/* Browse All Games Section */}
      {savedGamesList.length === 0 ? (
        // Show this when no bookmarked games
        <section className="text-center py-12">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">No Saved Games Yet</h3>
              <p className="text-gray-400">
                Discover amazing games and bookmark your favorites to create your personal collection.
              </p>
            </div>
            <Link
              href="/arcade/games"
              className="inline-flex items-center gap-2 bg-[#00daa2] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#00c49a] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Browse All Games
            </Link>
          </div>
        </section>
      ) : (
        // Show browse all games card when there are bookmarked games
        <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Discover More Games</h3>
              <p className="text-gray-400">
                Browse our full collection of {PLACEHOLDER_GAMES.length} games and find new favorites to bookmark.
              </p>
            </div>
            <Link
              href="/arcade/games"
              className="flex items-center gap-2 bg-[#00daa2] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00c49a] transition-colors shrink-0"
            >
              Browse All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
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