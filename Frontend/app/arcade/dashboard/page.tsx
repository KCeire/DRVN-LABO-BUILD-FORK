"use client";

import { useArcadeState } from "../../../hooks/useArcadeState";
import { ARCADE_GAMES, SAMPLE_PLAYER_STATS } from "../data/games";

export default function ArcadeDashboard() {
  const {
    selectedGame,
    modalOpen,
    bookmarkedGames,
    handleGameClick,
    handleBookmarkToggle,
    closeModal,
    createFilteredGames
  } = useArcadeState();

  const savedGames = createFilteredGames(ARCADE_GAMES).filter(game =>
    bookmarkedGames.has(game.id)
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">DRVN Arcade</h1>
        <p className="text-gray-400">Your gateway to automotive gaming</p>
      </div>

      {/* Player Stats Widget */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Player Level</p>
            <p className="text-2xl font-bold">{SAMPLE_PLAYER_STATS.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Total XP</p>
            <p className="text-2xl font-bold">{SAMPLE_PLAYER_STATS.totalXpEarned.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-2">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{
              width: `${(SAMPLE_PLAYER_STATS.xp / SAMPLE_PLAYER_STATS.nextLevelXp) * 100}%`
            }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span>{SAMPLE_PLAYER_STATS.xp} XP</span>
          <span>{SAMPLE_PLAYER_STATS.nextLevelXp} XP</span>
        </div>
      </div>

      {/* Saved Games Section */}
      {savedGames.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Saved Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedGames.map(game => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleGameClick(game)}
              >
                <div className="text-4xl mb-2">{game.icon}</div>
                <h3 className="font-medium truncate">{game.title}</h3>
                <p className="text-sm text-gray-400">{game.plays} plays</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Access Games */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Games</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ARCADE_GAMES.filter(game => game.featured).map(game => (
            <div
              key={game.id}
              className="relative bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors group"
              onClick={() => handleGameClick(game)}
            >
              {/* Bookmark button */}
              <button
                className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkToggle(game.id);
                }}
              >
                {bookmarkedGames.has(game.id) ? '★' : '☆'}
              </button>

              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="font-medium mb-1">{game.title}</h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{game.description}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{game.plays} plays</span>
                <span className="bg-blue-600 px-2 py-1 rounded">{game.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Games Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Games</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ARCADE_GAMES.map(game => (
            <div
              key={game.id}
              className="relative bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors group"
              onClick={() => handleGameClick(game)}
            >
              {/* Bookmark button */}
              <button
                className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkToggle(game.id);
                }}
              >
                {bookmarkedGames.has(game.id) ? '★' : '☆'}
              </button>

              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="font-medium mb-1">{game.title}</h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{game.description}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{game.plays} plays</span>
                <span className="bg-blue-600 px-2 py-1 rounded">{game.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Info Modal */}
      {modalOpen && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedGame.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{selectedGame.title}</h3>
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
              <span className="bg-blue-600 px-2 py-1 rounded">{selectedGame.category}</span>
              <span className="text-gray-400">{selectedGame.plays} plays</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleGameClick(selectedGame)}
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