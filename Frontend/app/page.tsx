"use client";

import { useEffect } from "react";
import { DRVNDashboard } from "./components/DRVNDashboard";
import { useAppInitialization } from "@/hooks/useAppInitialization";

export default function HomePage() {
  const { initialized, isInMiniApp, context, isLoading } = useAppInitialization();

  // Debug logging
  useEffect(() => {
    console.log("🚀 [page.tsx] Initialization status:", {
      initialized,
      isLoading,
      isInMiniApp,
      hasContext: !!context,
    });
  }, [initialized, isLoading, isInMiniApp, context]);

  // Debug context data when available
  useEffect(() => {
    if (context) {
      console.log("🚀 [page.tsx] Context data:", {
        user: context.user,
        client: context.client,
        location: context.location,
      });
    }
  }, [context]);

  // Show loading state while initializing or if in mini app but context not available yet
  if (isLoading || (isInMiniApp && !context)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00daa2] mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm font-sans">Loading DRVN VHCLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Main Dashboard Content */}
      <main className="flex-1">
        <DRVNDashboard />
      </main>
    </div>
  );
}
