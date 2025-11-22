'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Trophy,
  BarChart,
  Wrench,
  Upload,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BookmarkProvider } from './contexts/BookmarkContext';
import type { ArcadeNavItem } from './types';

const arcadeNavItems: ArcadeNavItem[] = [
  {
    label: 'Dashboard',
    href: '/arcade/dashboard',
    icon: Home,
    description: 'Main arcade hub',
  },
  {
    label: 'Games',
    href: '/arcade/games',
    icon: Gamepad2,
    description: 'Browse all games',
  },
  {
    label: 'Stats',
    href: '/arcade/stats',
    icon: BarChart,
    description: 'Your progress',
  },
  {
    label: 'Workshop',
    href: '/arcade/workshop',
    icon: Wrench,
    description: 'Craft assets',
  },
  {
    label: 'Submit',
    href: '/arcade/submit',
    icon: Upload,
    description: 'Submit your game',
  },
];

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Desktop Top Navigation */}
        <nav className="hidden md:flex border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8">
            {/* Return to Main App Button */}
            <Link
              href="/"
              className="flex items-center gap-2 py-4 px-3 text-gray-400 hover:text-white transition-colors"
              title="Return to main app"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block text-sm">Back</span>
            </Link>

            {/* Arcade Title */}
            <div className="py-4">
              <h1 className="text-xl font-bold font-mono text-[#00daa2]">
                🎮 ARCADE
              </h1>
            </div>

            {/* Navigation Items */}
            <div className="flex space-x-1">
              {arcadeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors border-b-2 border-transparent',
                      isActive
                        ? 'text-[#00daa2] border-[#00daa2] bg-gray-900/50'
                        : 'text-gray-400 hover:text-white hover:border-gray-600'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="grid grid-cols-6 h-16">
          {/* Return Button for Mobile */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs truncate">Back</span>
          </Link>

          {arcadeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-[#00daa2] bg-gray-800'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      </div>
    </BookmarkProvider>
  );
}