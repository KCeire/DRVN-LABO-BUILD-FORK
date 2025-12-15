"use client";

import { useArcadeState } from "../../../hooks/useArcadeState";
import { ARCADE_GAMES, GAME_CATEGORIES } from "../data/games";
import { Search, X, Filter } from "lucide-react";

export default function ArcadeGames() {
  const {
    selectedGame,
    modalOpen,
    bookmarkedGames,
    searchQuery,
    selectedCategory,
    showBookmarkedOnly,
    handleGameClick,
    handleBookmarkToggle,
    handleSearchChange,
    handleSearchClear,
    handleCategoryChange,
    handleBookmarkFilterToggle,
    closeModal,
    createFilteredGames
  } = useArcadeState();

  const filteredGames = createFilteredGames(ARCADE_GAMES);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Game Library</h1>
        <p className="text-gray-400">Discover and play automotive games</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00daa2] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {GAME_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#00daa2] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleBookmarkFilterToggle}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showBookmarkedOnly
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showBookmarkedOnly ? 'Saved Only' : 'Show All'}
          </button>

          {/* Results Count */}
          <span className="text-gray-400 text-sm">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
          </span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className="relative bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors group"
            onClick={() => handleGameClick(game)}
          >
            {/* Bookmark button */}
            <button
              className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 text-lg z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkToggle(game.id);
              }}
            >
              {bookmarkedGames.has(game.id) ? '★' : '☆'}
            </button>

            <div className="text-4xl mb-2">{game.icon}</div>
            <h3 className="font-medium mb-1 text-white">{game.title}</h3>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{game.description}</p>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">{game.plays} plays</span>
              <span className="bg-blue-600 px-2 py-1 rounded text-white">{game.category}</span>
            </div>

            {game.featured && (
              <div className="absolute top-2 left-2">
                <span className="bg-[#00daa2] text-black text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search or filters to find more games
          </p>
          <button
            onClick={() => {
              handleSearchClear();
              handleCategoryChange('All');
              if (showBookmarkedOnly) handleBookmarkFilterToggle();
            }}
            className="bg-[#00daa2] hover:bg-[#00c491] text-black px-4 py-2 rounded font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Game Info Modal */}
      {modalOpen && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedGame.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedGame.title}</h3>
                  <p className="text-gray-400">{selectedGame.developer}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 mb-4">{selectedGame.longDescription || selectedGame.description}</p>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded text-white">{selectedGame.category}</span>
              <span className="text-gray-400">{selectedGame.plays} plays</span>
            </div>

            {selectedGame.releasedAt && (
              <p className="text-gray-500 text-sm mb-4">
                Released: {new Date(selectedGame.releasedAt).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log('Launching game:', selectedGame.id);
                  alert(`🎮 Game "${selectedGame.title}" would launch here!\\n\\nIn the full version, this would open the actual game.`);
                }}
                className="bg-[#00daa2] hover:bg-[#00c491] text-black px-4 py-2 rounded font-medium flex-1"
              >
                Play Game
              </button>
              <button
                onClick={() => handleBookmarkToggle(selectedGame.id)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  bookmarkedGames.has(selectedGame.id)
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {bookmarkedGames.has(selectedGame.id) ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}