"use client";

import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { useScrollToTopWithDelay } from "../../../hooks/useScrollToTop";
import {
  Home,
  Gamepad2,
  BarChart3,
  Wrench,
  TrendingUp,
  Upload,
  ArrowLeft,
  FileText
} from "lucide-react";
import ArcadeDashboard from "../dashboard/page";
import ArcadeGames from "../games/page";
import ArcadeStats from "../stats/page";
import ArcadeWorkshop from "../workshop/page";
import ArcadeSubmit from "../submit/page";
import ArcadePredict from "../predict/page";

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: Home },
  { name: 'Games', id: 'games', icon: Gamepad2 },
  { name: 'Predict', id: 'predict', icon: TrendingUp },
  { name: 'Stats', id: 'stats', icon: BarChart3 },
  { name: 'Workshop', id: 'workshop', icon: Wrench },
];

interface ArcadeWithNavigationProps {
  onBackToMain?: () => void;
}

export default function ArcadeWithNavigation({ onBackToMain }: ArcadeWithNavigationProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { scrollToTopAfterStateUpdate } = useScrollToTopWithDelay();

  // Scroll to top whenever the active section changes
  useEffect(() => {
    scrollToTopAfterStateUpdate();
  }, [activeSection, scrollToTopAfterStateUpdate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ArcadeDashboard />;
      case 'games':
        return <ArcadeGames />;
      case 'stats':
        return <ArcadeStats />;
      case 'workshop':
        return <ArcadeWorkshop />;
      case 'predict':
        return <ArcadePredict />;
      case 'submit':
        return <ArcadeSubmit />;
      default:
        return <ArcadeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16">
            {/* Navigation items */}
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2",
                      isActive
                        ? "border-[#00daa2] text-[#00daa2]"
                        : "border-transparent text-gray-300 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center text-xs transition-colors",
                  isActive ? "text-[#00daa2]" : "text-gray-400"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {renderContent()}

        {/* Footer with Submit and Legal links */}
        <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveSection('submit')}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#00daa2] transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Submit a Game
                </button>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#00daa2] transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Legal & Policies
                </a>
              </div>
              <p className="text-gray-500 text-xs">
                © 2024 DRVN Arcade. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}