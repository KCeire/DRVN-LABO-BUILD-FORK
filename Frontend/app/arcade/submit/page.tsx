'use client';

import { Upload, Code, DollarSign, Trophy } from 'lucide-react';

export default function SubmitGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Upload className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold font-mono">Submit Your Game</h1>

          <p className="text-xl text-gray-400 font-sans">
            Built something awesome? Share it with the DRVN community
          </p>

          <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-semibold">
            Coming Soon
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Developer Program</h2>
          <p className="text-gray-300 mb-4">
            DRVN Arcade welcomes games from talented developers. Whether you built your game
            with <strong>OharaAI</strong> or your own code, we want to feature it.
          </p>
          <p className="text-gray-300">
            Games earn revenue from transaction fees and in-game assets, with splits
            benefiting both DRVN and developers.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <DollarSign className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="font-bold mb-2">Earn Revenue</h3>
            <p className="text-sm text-gray-400">
              Developers earn a share of all in-game transactions and NFT sales
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="font-bold mb-2">Reach Players</h3>
            <p className="text-sm text-gray-400">
              Get your game in front of the DRVN community on Base and Farcaster
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <Code className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="font-bold mb-2">Integration Support</h3>
            <p className="text-sm text-gray-400">
              Full documentation and developer tools to integrate with arcade
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <Upload className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="font-bold mb-2">Simple Process</h3>
            <p className="text-sm text-gray-400">
              Streamlined submission and approval process for quality games
            </p>
          </div>
        </div>

        {/* Requirements Preview */}
        <div className="bg-blue-900/20 rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Submission Requirements (Preview)
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Game must integrate with user&apos;s Base wallet</li>
            <li>✓ XP and achievement system integration</li>
            <li>✓ Revenue sharing smart contract compliance</li>
            <li>✓ Testing and quality assurance</li>
            <li>✓ Game assets (icon, screenshots, description)</li>
            <li>✓ Developer information and support contact</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Full requirements documentation will be available soon
          </p>
        </div>

        {/* Contact Form Placeholder */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Interested?</h3>
          <p className="mb-6">
            Leave your email and game details. We&apos;ll reach out when submissions open!
          </p>
          <button
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg opacity-50 cursor-not-allowed"
            disabled
          >
            Contact Form Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}