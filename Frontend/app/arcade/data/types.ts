// DRVN Arcade TypeScript Interfaces
// Extracted from working implementation - tested with all arcade features

// Player Stats Interface
export interface PlayerStats {
  xp: number;
  level: number;
  nextLevelXp: number;
  totalXpEarned: number;
  totalAchievements: number;
  unlockedAchievements: number;
}

// Game Definition Interface
export interface Game {
  id: string;
  title: string;
  icon: string; // Emoji or image URL
  description: string;
  longDescription?: string;
  thumbnail?: string;
  screenshots?: string[];
  plays: string; // Formatted play count (e.g., "1.2K")
  category: GameCategory;
  featured?: boolean;
  developer?: string;
  releasedAt?: string;
}

// Game Categories
export type GameCategory =
  | "Prediction"
  | "Skill"
  | "Strategy"
  | "Racing"
  | "Puzzle"
  | "Social";

// Achievement Interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or image URL
  unlocked: boolean;
  unlockedAt?: string;
  requirement?: string;
  xpReward?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

// Game Session Interface
export interface GameSession {
  id: string;
  gameId: string;
  gameName: string;
  result: GameResult;
  xpEarned: number;
  timestamp: string;
  duration?: number; // In seconds
  score?: number;
}

// Game Result Types
export type GameResult = "Win" | "Loss" | "Draw" | "Completed";

// Leaderboard Entry Interface
export interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  displayName: string;
  level: number;
  totalXp: number;
  achievements?: number;
}

// Saved Game Interface
export interface SavedGame {
  gameId: string;
  savedAt: string;
  lastPlayedAt?: string;
}

// Navigation Item Interface (for arcade sub-navigation)
export interface ArcadeNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// Arcade State Interface - for state management hook
export interface ArcadeState {
  arcadeTab: string;
  selectedGame: Game | null;
  modalOpen: boolean;
  bookmarkedGames: Set<string>;
  leaderboardView: 'global' | 'byGame';
  selectedGameLeaderboard: string;
  searchQuery: string;
  selectedCategory: string;
  showBookmarkedOnly: boolean;
}