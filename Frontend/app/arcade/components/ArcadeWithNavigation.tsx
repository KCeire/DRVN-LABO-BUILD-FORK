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
  FileText,
  ChevronUp,
  X,
  ArrowLeft
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollToTopAfterStateUpdate } = useScrollToTopWithDelay();

  // Scroll to top whenever the active section changes
  useEffect(() => {
    scrollToTopAfterStateUpdate();
  }, [activeSection, scrollToTopAfterStateUpdate]);

  // Handle mobile bottom sheet swipe to close (swipe down)
  useEffect(() => {
    if (!mobileMenuOpen) return;

    let startY = 0;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      startY = touchEvent.touches[0].clientY;
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      const currentY = touchEvent.touches[0].clientY;
      const deltaY = currentY - startY;

      // If user swipes down (closing gesture)
      if (deltaY > 50) {
        setMobileMenuOpen(false);
      }
    };

    // Add touch event listeners to the mobile bottom sheet
    const mobileSidebar = document.querySelector("[data-arcade-mobile-menu]");
    if (mobileSidebar) {
      mobileSidebar.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      mobileSidebar.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }

    return () => {
      if (mobileSidebar) {
        mobileSidebar.removeEventListener("touchstart", handleTouchStart);
        mobileSidebar.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-50" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Bottom Sheet - Rises from bottom */}
      <div
        data-arcade-mobile-menu
        className={`fixed bottom-0 left-0 right-0 z-60 flex flex-col gap-y-5 overflow-y-auto border-t border-[#00daa2] bg-gray-950 px-4 transform transition-transform duration-300 ease-out md:hidden rounded-t-3xl max-h-[85vh] ${
          mobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag Handle / Close Button */}
        <div className="flex items-center justify-center pt-4 pb-2 sticky top-0 bg-gray-950 z-10">
          <button onClick={toggleMobileMenu} className="flex flex-col items-center gap-1 w-full">
            <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
            <X className="h-5 w-5 text-gray-400 mt-1" />
          </button>
        </div>

        {/* Logo/Title Section */}
        <div className="relative flex h-12 shrink-0 items-center justify-center">
          <h2 className="text-xl font-bold text-[#00daa2]">DRVN Arcade</h2>
        </div>

        {/* Navigation */}
        <nav className="relative flex flex-1 flex-col pb-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {/* Back to Main Menu */}
            {onBackToMain && (
              <li>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    onBackToMain();
                  }}
                  className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold w-full text-left text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft className="size-6 shrink-0 text-gray-400 group-hover:text-white" />
                  Back to Main Menu
                </button>
              </li>
            )}

            {/* Divider after back button */}
            {onBackToMain && <li className="border-t border-gray-800 my-2"></li>}

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      toggleMobileMenu();
                    }}
                    className={`group flex gap-x-3 rounded-md p-3 text-sm font-semibold w-full text-left ${
                      isActive
                        ? "bg-[#00daa2]/10 text-[#00daa2]"
                        : "text-gray-400 hover:bg-white/5 hover:text-[#00daa2]"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`${
                        isActive
                          ? "text-[#00daa2]"
                          : "text-gray-400 group-hover:text-[#00daa2]"
                      } size-6 shrink-0`}
                    />
                    {item.name}
                  </button>
                </li>
              );
            })}

            {/* Divider */}
            <li className="border-t border-gray-800 my-2"></li>

            {/* Submit Game Button */}
            <li>
              <button
                onClick={() => {
                  setActiveSection('submit');
                  toggleMobileMenu();
                }}
                className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold w-full text-left text-gray-400 hover:bg-white/5 hover:text-[#00daa2]"
              >
                <Upload className="size-6 shrink-0 text-gray-400 group-hover:text-[#00daa2]" />
                Submit a Game
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar - Menu Trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gray-950/40 backdrop-blur-sm px-2 py-1.5 safe-area-inset-bottom">
        <div className="flex items-center justify-center">
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center gap-0.5 px-6 py-1.5 rounded-full bg-transparent hover:bg-[#00daa2]/10 transition-all duration-200"
          >
            <ChevronUp
              className={`h-6 w-6 text-[#00daa2] transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-180" : "animate-pulse"
              }`}
              style={
                !mobileMenuOpen
                  ? {
                      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    }
                  : undefined
              }
            />
            <span className="text-[10px] text-[#00daa2] font-mono font-semibold">Menu</span>
          </button>
        </div>
      </div>

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
