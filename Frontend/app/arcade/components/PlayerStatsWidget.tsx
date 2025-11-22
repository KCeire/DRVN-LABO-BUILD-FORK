'use client';

import XPProgressBar from './XPProgressBar';
import { Identity, Name } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import type { PlayerStats } from '../types';

interface PlayerStatsWidgetProps {
  stats: PlayerStats;
}

// Utility function to format wallet address
function formatAddress(address?: string): string {
  if (!address) return '0x0000...0000';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function PlayerStatsWidget({ stats }: PlayerStatsWidgetProps) {
  const { address } = useAccount();

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-8xl">🎮</div>
      </div>

      <div className="relative z-10">
        {/* Header with User Info and Level Badge */}
        <div className="flex items-center justify-between mb-6">
          {/* User Info with real wallet/ENS data */}
          <div>
            <p className="text-sm opacity-80 font-sans">
              Player
            </p>
            <div className="text-xl font-bold font-mono">
              {address ? (
                <Identity className="text-white font-mono text-xl bg-transparent">
                  <Name className="text-white font-mono text-xl bg-transparent" />
                </Identity>
              ) : (
                <span>{formatAddress(address)}</span>
              )}
            </div>
          </div>

          {/* Level Badge */}
          <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <p className="text-xs font-semibold">LEVEL</p>
              <p className="text-2xl font-bold">{stats.level}</p>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-mono">{stats.xp.toLocaleString()} XP</span>
            <span className="font-mono">{stats.nextLevelXp.toLocaleString()} XP</span>
          </div>
          <XPProgressBar
            currentXp={stats.xp}
            nextLevelXp={stats.nextLevelXp}
            level={stats.level}
            size="lg"
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span>{stats.unlockedAchievements} / {stats.totalAchievements} Achievements</span>
          </div>
          <div className="text-right">
            <span className="opacity-80">Total: </span>
            <span className="font-mono font-bold">{stats.totalXpEarned.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}