"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useUnifiedMiniAppDetection } from "./useUnifiedMiniAppDetection";
import { useFrameReady } from "./useFrameReady";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * useAppInitialization - Coordinates all app initialization logic
 * 
 * This hook coordinates the initialization sequence:
 * 1. Dismiss Farcaster splash screen (sdk.actions.ready())
 * 2. Detect mini app context (via useUnifiedMiniAppDetection)
 * 3. Detect frame ready status (via useFrameReady)
 * 4. Monitor wallet connection status
 * 
 * Note: When miniKit is disabled, context will be null.
 * This ensures proper initialization order and provides a single
 * place to check if the app is fully initialized.
 */
export function useAppInitialization() {
  const { isFrameReady } = useFrameReady();
  const { isInMiniApp, isLoading: isDetectionLoading } = useUnifiedMiniAppDetection();
  const { isConnected, address } = useAccount();
  const [initialized, setInitialized] = useState(false);
  const [farcasterReady, setFarcasterReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Step 1: Dismiss Farcaster splash screen (if in Farcaster)
        try {
          await sdk.actions.ready();
          setFarcasterReady(true);
          console.log("✅ [useAppInitialization] Farcaster SDK ready() called");
        } catch {
          // Not in Farcaster environment - this is fine
          setFarcasterReady(true); // Mark as ready anyway
          console.log("ℹ️ [useAppInitialization] Not in Farcaster environment");
        }

        // Step 2: Wait for detection to complete
        // Detection is handled by useUnifiedMiniAppDetection hook
        // Frame ready is handled by useFrameReady hook

        // Step 3: Try to get Farcaster context if available
        try {
          if (isInMiniApp) {
            const farcasterContext = await sdk.context;
            setContext(farcasterContext);
          }
        } catch {
          // Context not available - this is fine
        }

        // Step 4: Mark as initialized once detection is complete
        if (!isDetectionLoading) {
          setInitialized(true);
          console.log("✅ [useAppInitialization] App initialization complete", {
            isInMiniApp,
            isFrameReady,
            hasContext: !!context,
          });
        }
      } catch (error) {
        console.error("❌ [useAppInitialization] Initialization error:", error);
        // Still mark as initialized to prevent blocking
        setInitialized(true);
      }
    };

    initialize();
  }, [isDetectionLoading, isInMiniApp, isFrameReady]);

  return {
    initialized,
    isInMiniApp,
    isFrameReady,
    isConnected,
    address,
    context,
    farcasterReady,
    isLoading: isDetectionLoading || !initialized,
  };
}
