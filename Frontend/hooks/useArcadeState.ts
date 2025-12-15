"use client";

import { useState, useEffect, useCallback } from "react";
import type { Game } from "../app/arcade/data/types";

// Comprehensive arcade state management hook
// Extracted from working implementation with bookmark persistence and filtering

export function useArcadeState() {
  // Core arcade navigation state
  const [arcadeTab, setArcadeTab] = useState("dashboard");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Leaderboard state
  const [leaderboardView, setLeaderboardView] = useState<'global' | 'byGame'>('global');
  const [selectedGameLeaderboard, setSelectedGameLeaderboard] = useState<string>('1');

  // Game filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Bookmark state with localStorage persistence
  const [bookmarkedGames, setBookmarkedGames] = useState<Set<string>>(new Set());

  // Initialize bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('drvn-bookmarked-games');
        if (saved) {
          const bookmarkArray = JSON.parse(saved);
          if (Array.isArray(bookmarkArray)) {
            setBookmarkedGames(new Set(bookmarkArray));
          }
        }
      } catch (error) {
        console.error('Error loading bookmarked games:', error);
      }
    }
  }, []);

  // Game interaction handlers
  const handleGameClick = useCallback((game: Game) => {
    setSelectedGame(game);
    setModalOpen(true);
  }, []);

  const handleGameLaunch = useCallback((gameId: string) => {
    console.log('Launching game:', gameId);
    // In production, this would integrate with actual game launching system
    alert(`🎮 Game "${selectedGame?.title}" would launch here!\\n\\nIn the full version, this would open the actual game.`);
  }, [selectedGame]);

  const handleBookmarkToggle = useCallback((gameId: string) => {
    setBookmarkedGames((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(gameId)) {
        newSet.delete(gameId);
      } else {
        newSet.add(gameId);
      }

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('drvn-bookmarked-games', JSON.stringify(Array.from(newSet)));
        } catch (error) {
          console.error('Error saving bookmarked games:', error);
        }
      }

      return newSet;
    });
  }, []);

  // Game filtering handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleBookmarkFilterToggle = useCallback(() => {
    setShowBookmarkedOnly(!showBookmarkedOnly);
  }, [showBookmarkedOnly]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Arcade tab navigation with scroll-to-top
  const handleArcadeTabChange = useCallback((tabId: string) => {
    setArcadeTab(tabId);

    // Scroll to top when tab changes
    if (typeof window !== 'undefined') {
      const scrollableSelectors = [
        '.overflow-auto',
        '.overflow-y-auto',
        '.overflow-scroll',
        '.overflow-y-scroll',
        'main',
        '.min-h-screen',
        '.space-y-6'
      ];

      scrollableSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (element instanceof HTMLElement && element.scrollTop > 0) {
              element.scrollTo(0, 0);
              element.scrollTop = 0;
            }
          });
        } catch {
          // Ignore errors
        }
      });

      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  // Create filtered games function (to be used with game data)
  const createFilteredGames = useCallback((games: Game[]) => {
    return games.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedGames.has(game.id);
      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [searchQuery, selectedCategory, showBookmarkedOnly, bookmarkedGames]);

  // Modal controls
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedGame(null);
  }, []);

  return {
    // State
    arcadeTab,
    selectedGame,
    modalOpen,
    bookmarkedGames,
    leaderboardView,
    selectedGameLeaderboard,
    searchQuery,
    selectedCategory,
    showBookmarkedOnly,

    // Tab navigation
    setArcadeTab: handleArcadeTabChange,

    // Game interactions
    handleGameClick,
    handleGameLaunch,
    handleBookmarkToggle,

    // Filtering
    handleSearchChange,
    handleSearchClear,
    handleCategoryChange,
    handleBookmarkFilterToggle,
    createFilteredGames,

    // Modal controls
    closeModal,

    // Leaderboard controls
    setLeaderboardView,
    setSelectedGameLeaderboard,
  };
}