"use client";

import { SAMPLE_PLAYER_STATS, ARCADE_GAMES } from "../data/games";
import { Trophy, Target, Clock, Zap } from "lucide-react";

export default function ArcadeStats() {
  // Mock recent sessions data
  const recentSessions = [
    { id: '1', gameName: 'F1 Race Predictor', xpEarned: 150, timestamp: '2024-12-01T10:30:00Z', result: 'Win' },
    { id: '2', gameName: 'Drift King', xpEarned: 120, timestamp: '2024-12-01T09:15:00Z', result: 'Completed' },
    { id: '3', gameName: 'Reaction Challenge', xpEarned: 80, timestamp: '2024-11-30T16:45:00Z', result: 'Loss' },
    { id: '4', gameName: 'Engine Puzzle', xpEarned: 200, timestamp: '2024-11-30T14:20:00Z', result: 'Win' },
    { id: '5', gameName: 'Tuner Shop Tycoon', xpEarned: 175, timestamp: '2024-11-30T11:10:00Z', result: 'Completed' },
  ];

  // Mock achievements data
  const achievements = [
    { id: '1', title: 'First Steps', description: 'Play your first game', unlocked: true, icon: '🏁', rarity: 'common' },
    { id: '2', title: 'Speed Demon', description: 'Win 5 racing games', unlocked: true, icon: '🏎️', rarity: 'rare' },
    { id: '3', title: 'Puzzle Master', description: 'Complete 10 puzzle games', unlocked: true, icon: '🧩', rarity: 'epic' },
    { id: '4', title: 'Social Butterfly', description: 'Share 3 garage builds', unlocked: false, icon: '👥', rarity: 'common' },
    { id: '5', title: 'Legendary Racer', description: 'Reach Level 20', unlocked: false, icon: '🏆', rarity: 'legendary' },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Player Stats</h1>
        <p className="text-gray-400">Track your gaming progress and achievements</p>
      </div>

      {/* Player Level Card */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Current Level</p>
            <p className="text-4xl font-bold">{SAMPLE_PLAYER_STATS.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Total XP Earned</p>
            <p className="text-2xl font-bold">{SAMPLE_PLAYER_STATS.totalXpEarned.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Level {SAMPLE_PLAYER_STATS.level + 1}</span>
            <span>{SAMPLE_PLAYER_STATS.xp}/{SAMPLE_PLAYER_STATS.nextLevelXp} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{
                width: `${(SAMPLE_PLAYER_STATS.xp / SAMPLE_PLAYER_STATS.nextLevelXp) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
          <p className="text-gray-400 text-sm">Achievements</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{ARCADE_GAMES.length}</p>
          <p className="text-gray-400 text-sm">Games Played</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">24h</p>
          <p className="text-gray-400 text-sm">Time Played</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">7</p>
          <p className="text-gray-400 text-sm">Win Streak</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                achievement.unlocked
                  ? 'bg-gray-700 border border-gray-600'
                  : 'bg-gray-900 border border-gray-800 opacity-60'
              }`}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <h3 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  achievement.rarity === 'common' ? 'bg-gray-600 text-gray-300' :
                  achievement.rarity === 'rare' ? 'bg-blue-600 text-white' :
                  achievement.rarity === 'epic' ? 'bg-purple-600 text-white' :
                  'bg-yellow-600 text-black'
                }`}>
                  {achievement.rarity}
                </span>
                {achievement.unlocked && (
                  <span className="text-green-500 text-sm">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Sessions</h2>
        <div className="space-y-3">
          {recentSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-white">{session.gameName}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(session.timestamp).toLocaleDateString()} at{' '}
                  {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-1 rounded font-medium ${
                  session.result === 'Win' ? 'bg-green-600 text-white' :
                  session.result === 'Loss' ? 'bg-red-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {session.result}
                </span>
                <span className="text-yellow-500 font-medium">+{session.xpEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}