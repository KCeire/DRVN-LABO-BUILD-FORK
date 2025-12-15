"use client";

import { Wrench, Hammer, Paintbrush, Settings } from "lucide-react";

export default function ArcadeWorkshop() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Game Workshop</h1>
        <p className="text-gray-400">Create and customize your own gaming experiences</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold mb-2">Workshop Coming Soon!</h2>
        <p className="mb-4">
          The Game Workshop is currently under development. Soon you&apos;ll be able to create custom tracks,
          design challenges, and build your own automotive gaming experiences.
        </p>
        <div className="bg-white/20 rounded-lg p-4 text-left inline-block">
          <h3 className="font-semibold mb-2">Planned Features:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Track Editor for racing games</li>
            <li>• Custom challenge creator</li>
            <li>• Car tuning simulator builder</li>
            <li>• Community sharing platform</li>
          </ul>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Wrench className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">Track Builder</h3>
          <p className="text-gray-400 text-sm">
            Design custom racing tracks with advanced terrain tools
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Hammer className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">Challenge Creator</h3>
          <p className="text-gray-400 text-sm">
            Build unique skill challenges and puzzles for the community
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Paintbrush className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">Visual Editor</h3>
          <p className="text-gray-400 text-sm">
            Customize the look and feel of your created content
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Settings className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">Game Logic</h3>
          <p className="text-gray-400 text-sm">
            Define rules, scoring systems, and win conditions
          </p>
        </div>
      </div>

      {/* Subscribe for Updates */}
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
        <p className="text-gray-400 mb-4">
          Want to be notified when the Workshop launches? Join our community for updates!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => alert('Community features coming soon!')}
            className="bg-[#00daa2] hover:bg-[#00c491] text-black px-6 py-2 rounded font-medium"
          >
            Join Community
          </button>
          <button
            onClick={() => alert('Newsletter signup coming soon!')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium"
          >
            Get Updates
          </button>
        </div>
      </div>
    </div>
  );
}