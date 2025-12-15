import type { Game, PlayerStats } from "./types";

// Comprehensive game data extracted from working arcade implementation
// These 8 games have been tested with filtering, search, and mobile responsive design

export const ARCADE_GAMES: Game[] = [
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
    developer: 'DRVN Community',
    releasedAt: '2024-10-15',
  },
  {
    id: '3',
    title: 'Tuner Shop Tycoon',
    icon: '🔧',
    description: 'Build and manage your car tuning empire',
    longDescription: 'Start with a small garage and grow it into a tuning empire. Upgrade cars, satisfy customers, and compete in the marketplace.',
    plays: '2.1K',
    category: 'Strategy',
    developer: 'DRVN Labs',
    releasedAt: '2024-09-20',
  },
  {
    id: '4',
    title: 'Drift King',
    icon: '🏎️',
    description: 'Master the art of drifting',
    longDescription: 'Experience the thrill of drifting with realistic physics. Master different tracks and compete for the highest drift scores.',
    plays: '980',
    category: 'Racing',
    developer: 'Speed Studios',
    releasedAt: '2024-10-01',
  },
  {
    id: '5',
    title: 'Engine Puzzle',
    icon: '🧩',
    description: 'Solve mechanical puzzles',
    longDescription: 'Test your mechanical knowledge by solving complex engine puzzles. Learn about car parts while having fun!',
    plays: '650',
    category: 'Puzzle',
    developer: 'Edu Games',
    releasedAt: '2024-08-12',
  },
  {
    id: '6',
    title: 'Garage Stories',
    icon: '👥',
    description: 'Share your builds and connect',
    longDescription: 'Show off your car builds and connect with other enthusiasts. Rate builds, share tips, and discover new inspiration.',
    plays: '1.5K',
    category: 'Social',
    developer: 'Community Hub',
    releasedAt: '2024-10-30',
  },
  {
    id: '7',
    title: 'Track Master',
    icon: '🏁',
    description: 'Design and race on custom tracks',
    longDescription: 'Create your own racing tracks and challenge the community. Use the track editor to build complex circuits.',
    plays: '720',
    category: 'Strategy',
    developer: 'Track Labs',
    releasedAt: '2024-11-05',
  },
  {
    id: '8',
    title: 'Nitro Rush',
    icon: '💨',
    description: 'High-speed arcade racing',
    longDescription: 'Fast-paced arcade racing with power-ups and nitro boosts. Race through dynamic tracks with changing weather.',
    plays: '1.8K',
    category: 'Racing',
    developer: 'Rush Games',
    releasedAt: '2024-09-15',
  },
];

// Sample player stats for testing and initial data
export const SAMPLE_PLAYER_STATS: PlayerStats = {
  level: 12,
  xp: 2450,
  nextLevelXp: 3000,
  totalXpEarned: 12450,
  totalAchievements: 15,
  unlockedAchievements: 8,
};

// Game categories with display names - tested with filtering system
export const GAME_CATEGORIES = [
  'All',
  'Prediction',
  'Skill',
  'Strategy',
  'Racing',
  'Puzzle',
  'Social'
] as const;

export type GameCategory = typeof GAME_CATEGORIES[number];