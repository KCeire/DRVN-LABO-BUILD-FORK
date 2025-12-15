"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  Home,
  Gamepad2,
  BarChart3,
  Wrench,
  Upload,
  ArrowLeft
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/arcade/dashboard', icon: Home },
  { name: 'Games', href: '/arcade/games', icon: Gamepad2 },
  { name: 'Stats', href: '/arcade/stats', icon: BarChart3 },
  { name: 'Workshop', href: '/arcade/workshop', icon: Wrench },
  { name: 'Submit', href: '/arcade/submit', icon: Upload },
];

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs transition-colors",
                  isActive ? "text-[#00daa2]" : "text-gray-400"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}