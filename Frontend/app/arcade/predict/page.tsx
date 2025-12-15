"use client";

import { useArcadeState } from "../../../hooks/useArcadeState";
import { ARCADE_GAMES } from "../data/games";

export default function ArcadePredict() {
  const {
    selectedGame,
    modalOpen,
    bookmarkedGames,
    handleGameClick,
    handleBookmarkToggle,
    closeModal
  } = useArcadeState();

  // Filter for prediction games only
  const predictionGames = ARCADE_GAMES.filter(game =>
    game.category === "Prediction"
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Prediction Games</h1>
        <p className="text-gray-400">Test your forecasting skills and predict outcomes</p>
      </div>

      {/* Featured Prediction Game */}
      {predictionGames.filter(game => game.featured).length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictionGames.filter(game => game.featured).map(game => (
              <div
                key={game.id}
                className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6 cursor-pointer hover:from-blue-900/70 hover:to-purple-900/70 transition-all"
                onClick={() => handleGameClick(game)}
              >
                {/* Bookmark button */}
                <button
                  className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-400 text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(game.id);
                  }}
                >
                  {bookmarkedGames.has(game.id) ? '★' : '☆'}
                </button>

                <div className="flex items-start gap-4">
                  <div className="text-5xl">{game.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                    <p className="text-gray-300 mb-3">{game.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{game.plays} predictions</span>
                      <span className="bg-blue-600 px-3 py-1 rounded text-sm">Featured</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Prediction Games */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Prediction Games</h2>
        {predictionGames.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {predictionGames.map(game => (
              <div
                key={game.id}
                className="relative bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors group"
                onClick={() => handleGameClick(game)}
              >
                {/* Bookmark button */}
                <button
                  className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                  {game.featured && (
                    <span className="bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded">Featured</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-gray-400 mb-2">No prediction games available yet</p>
            <p className="text-sm text-gray-500">Check back soon for exciting prediction challenges!</p>
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">More Predictions Coming Soon!</h3>
        <p className="text-gray-400 mb-4">
          We&apos;re working on bringing you more prediction games including sports, crypto markets,
          and automotive industry trends. Stay tuned!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-2xl mb-1">🏎️</div>
            <div className="text-sm">Race Results</div>
          </div>
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm">Market Trends</div>
          </div>
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm">EV Adoption</div>
          </div>
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm">Championships</div>
          </div>
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