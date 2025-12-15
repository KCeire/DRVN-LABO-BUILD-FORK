"use client";

import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { useFrameReady } from "@/hooks/useFrameReady";
import { useUnifiedMiniAppDetection } from "@/hooks/useUnifiedMiniAppDetection";

/**
 * ConditionalLayout - Ensures mini app is properly initialized for auto-connect
 * 
 * This component uses the centralized useFrameReady hook to set frame ready status.
 * All frame ready logic is now consolidated in useFrameReady.ts to prevent
 * race conditions and duplicate calls.
 */
export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const { isFrameReady } = useFrameReady();
  const { isInMiniApp } = useUnifiedMiniAppDetection();
  const { address, isConnected } = useAccount();

  // Debug logging for mini app wallet connection status
  useEffect(() => {
    if (isInMiniApp) {
      console.log("🔗 [ConditionalLayout] Mini app status:", {
        isFrameReady,
        isConnected,
        address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
      });
      
      // If frame is ready but not connected after 3 seconds, auto-connect might have failed
      if (isFrameReady && !isConnected) {
        const timeout = setTimeout(() => {
          console.warn("⚠️ [ConditionalLayout] Auto-connect may have failed - wallet not connected after frame ready");
          console.log("💡 User can manually connect by clicking Connect Wallet button");
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [isInMiniApp, isFrameReady, isConnected, address]);

  return <>{children}</>;
}
