"use client";

import { Upload, FileText, Image, Settings, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ArcadeSubmit() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'assets', label: 'Assets', icon: Image },
    { id: 'config', label: 'Config', icon: Settings },
    { id: 'review', label: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Submit Your Game</h1>
        <p className="text-gray-400">Share your creation with the DRVN community</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white text-center">
        <div className="text-6xl mb-4">📤</div>
        <h2 className="text-2xl font-bold mb-2">Submission System Coming Soon!</h2>
        <p className="mb-4">
          Our game submission platform is currently in development. Soon you&apos;ll be able to submit
          your custom games, tracks, and challenges directly to the DRVN Arcade.
        </p>
        <div className="bg-white/20 rounded-lg p-4 text-left inline-block max-w-md">
          <h3 className="font-semibold mb-2">Submission Process Will Include:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Upload game files and assets</li>
            <li>• Community review and rating</li>
            <li>• Automated testing and validation</li>
            <li>• Publishing to the arcade library</li>
            <li>• Creator revenue sharing (coming later)</li>
          </ul>
        </div>
      </div>

      {/* Submission Process Preview */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-[#00daa2] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Game Information</h3>
              <p className="text-gray-400 mb-4">
                Provide basic details about your game submission.
              </p>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Game Title</label>
                    <input
                      type="text"
                      placeholder="Enter your game title..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" disabled>
                      <option>Select category...</option>
                      <option>Racing</option>
                      <option>Strategy</option>
                      <option>Skill</option>
                      <option>Puzzle</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your game..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'assets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Game Assets</h3>
              <p className="text-gray-400 mb-4">
                Upload your game files, images, and other assets.
              </p>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop your files here</p>
                <p className="text-gray-500 text-sm">Supported: .zip, .tar.gz, .js, .html (Max: 50MB)</p>
              </div>
            </div>
          )}

          {selectedTab === 'config' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Game Configuration</h3>
              <p className="text-gray-400 mb-4">
                Configure gameplay settings and publishing options.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-[#00daa2]" disabled />
                  <label className="text-gray-300">Enable multiplayer support</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-[#00daa2]" disabled />
                  <label className="text-gray-300">Allow community modifications</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-[#00daa2]" disabled />
                  <label className="text-gray-300">Include in featured games rotation</label>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'review' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Review & Submit</h3>
              <p className="text-gray-400 mb-4">
                Review your submission before publishing to the arcade.
              </p>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Submission Checklist:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4 border border-gray-500 rounded flex items-center justify-center text-xs">✓</span>
                    Game information completed
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4 border border-gray-500 rounded flex items-center justify-center text-xs">✓</span>
                    Assets uploaded
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-4 h-4 border border-gray-500 rounded flex items-center justify-center text-xs">✓</span>
                    Configuration set
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Resources */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Developer Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">📘 Documentation</h4>
            <p className="text-gray-400 text-sm mb-3">
              Learn about game development guidelines and API references
            </p>
            <button
              onClick={() => alert('Documentation coming soon!')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              View Docs
            </button>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">💬 Community</h4>
            <p className="text-gray-400 text-sm mb-3">
              Connect with other developers and get support
            </p>
            <button
              onClick={() => alert('Community features coming soon!')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Join Discord
            </button>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">🎯 Examples</h4>
            <p className="text-gray-400 text-sm mb-3">
              Browse sample games and starter templates
            </p>
            <button
              onClick={() => alert('Examples coming soon!')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              View Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}