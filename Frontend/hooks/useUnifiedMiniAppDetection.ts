"use client";
import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * useUnifiedMiniAppDetection - Unified hook for detecting mini app context
 * 
 * This hook consolidates detection from both OnchainKit and Farcaster SDK
 * into a single source of truth. It provides:
 * 
 * - Combined detection result (either method can detect mini app)
 * - Individual detection results for debugging
 * - Loading state while detection is in progress
 * 
 * This prevents inconsistencies when different components use different
 * detection methods.
 */
export function useUnifiedMiniAppDetection() {
  const [isInMiniAppFarcaster, setIsInMiniAppFarcaster] = useState<boolean | null>(null);
  const [isInMiniAppOnchainKit, setIsInMiniAppOnchainKit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        // Check Farcaster SDK
        const farcasterStatus = await sdk.isInMiniApp();
        setIsInMiniAppFarcaster(farcasterStatus);
        
        // Check iframe (for Base App or other mini apps)
        if (typeof window !== "undefined") {
          const isInIframe = window.self !== window.top;
          setIsInMiniAppOnchainKit(isInIframe);
        }
      } catch {
        // Not in Farcaster environment or SDK not available
        setIsInMiniAppFarcaster(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMiniApp();
  }, []);

  // Use either detection method - if either says we're in a mini app, we are
  // This ensures we catch both Base App (iframe) and Farcaster mini apps
  const isInMiniApp = isInMiniAppOnchainKit === true || isInMiniAppFarcaster === true;

  return {
    isInMiniApp,
    isInMiniAppOnchainKit,
    isInMiniAppFarcaster,
    isLoading,
  };
}
