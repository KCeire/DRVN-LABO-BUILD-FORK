"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  Home,
  Gamepad2,
  BarChart3,
  Wrench,
  Upload,
  ArrowLeft,
  TrendingUp,
  ChevronUp,
  X
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/arcade/dashboard', icon: Home },
  { name: 'Games', href: '/arcade/games', icon: Gamepad2 },
  { name: 'Predict', href: '/arcade/predict', icon: TrendingUp },
  { name: 'Stats', href: '/arcade/stats', icon: BarChart3 },
  { name: 'Workshop', href: '/arcade/workshop', icon: Wrench },
];

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const mobileSidebar = document.querySelector("[data-arcade-layout-menu]");
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            {/* Back to main app */}
            <Link
              href="/"
              className="flex items-center gap-2 pr-6 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>

            {/* Navigation items */}
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors",
                      isActive
                        ? "border-b-2 border-[#00daa2] text-[#00daa2]"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
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
        data-arcade-layout-menu
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
            {/* Back to main app */}
            <li>
              <Link
                href="/"
                onClick={toggleMobileMenu}
                className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold w-full text-left text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="size-6 shrink-0 text-gray-400 group-hover:text-white" />
                Back to Main
              </Link>
            </li>

            {/* Divider */}
            <li className="border-t border-gray-800 my-2"></li>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={toggleMobileMenu}
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
                  </Link>
                </li>
              );
            })}

            {/* Divider */}
            <li className="border-t border-gray-800 my-2"></li>

            {/* Submit Game Button */}
            <li>
              <Link
                href="/arcade/submit"
                onClick={toggleMobileMenu}
                className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold w-full text-left text-gray-400 hover:bg-white/5 hover:text-[#00daa2]"
              >
                <Upload className="size-6 shrink-0 text-gray-400 group-hover:text-[#00daa2]" />
                Submit a Game
              </Link>
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
        {children}
      </main>
    </div>
  );
}
