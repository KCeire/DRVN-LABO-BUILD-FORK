'use client';

import { Wrench, Sparkles, Package } from 'lucide-react';

export default function WorkshopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Wrench className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold font-mono">Workshop</h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 font-sans">
          Craft unique assets by combining tokens and NFTs
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-semibold">
          Coming Soon
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-lg p-8 text-left max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300 mb-4">
            The Workshop uses the <strong>RYFT wrapping system</strong> to let you combine
            DRVN ecosystem tokens and NFTs into new, exclusive assets.
          </p>
          <p className="text-gray-300 mb-4">
            Think of it like a <strong>Minecraft crafting table</strong> - combine the right
            ingredients to unlock rare items, special abilities, and exclusive rewards!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-900 rounded-lg p-6">
            <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Combine Assets</h3>
            <p className="text-sm text-gray-400">
              Mix BSTR tokens with vehicle NFTs to create upgraded versions
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Craft Rares</h3>
            <p className="text-sm text-gray-400">
              Special recipes unlock exclusive, limited-edition assets
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <Wrench className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Use in Games</h3>
            <p className="text-sm text-gray-400">
              Crafted assets give you advantages in arcade games
            </p>
          </div>
        </div>

        {/* Email Signup (non-functional placeholder) */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Get Notified</h3>
          <p className="mb-6">Be the first to know when the Workshop launches!</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              disabled
            />
            <button
              className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Notify Me
            </button>
          </div>
          <p className="text-sm mt-3 opacity-80">
            Email signup coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}