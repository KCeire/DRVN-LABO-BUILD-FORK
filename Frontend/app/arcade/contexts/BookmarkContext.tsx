'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarkedGames: Set<string>;
  toggleBookmark: (gameId: string) => void;
  isBookmarked: (gameId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarkedGames, setBookmarkedGames] = useState<Set<string>>(new Set());

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drvn-arcade-bookmarks');
      if (saved) {
        try {
          const bookmarkArray = JSON.parse(saved);
          setBookmarkedGames(new Set(bookmarkArray));
        } catch (error) {
          console.error('Failed to parse saved bookmarks:', error);
        }
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarkArray = Array.from(bookmarkedGames);
      localStorage.setItem('drvn-arcade-bookmarks', JSON.stringify(bookmarkArray));
    }
  }, [bookmarkedGames]);

  const toggleBookmark = (gameId: string) => {
    setBookmarkedGames((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(gameId)) {
        newSet.delete(gameId);
      } else {
        newSet.add(gameId);
      }
      return newSet;
    });
  };

  const isBookmarked = (gameId: string) => {
    return bookmarkedGames.has(gameId);
  };

  const value: BookmarkContextType = {
    bookmarkedGames,
    toggleBookmark,
    isBookmarked,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}