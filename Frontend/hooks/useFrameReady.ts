"use client";
import { useEffect, useRef, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * useFrameReady - Centralized hook for setting frame ready status
 * 
 * This hook consolidates all frame ready logic into a single place to prevent
 * race conditions and duplicate calls. It uses multiple detection strategies:
 * 
 * 1. Immediate iframe check (synchronous)
 * 2. Farcaster SDK detection (async)
 * 
 * Note: When miniKit is disabled, this hook only detects mini app context
 * but cannot set frame ready (requires miniKit to be enabled).
 */
export function useFrameReady() {
  const hasSetRef = useRef(false);
  const [isFrameReady, setIsFrameReady] = useState(false);

  useEffect(() => {
    // Don't set if already set
    if (hasSetRef.current) return;

    const initialize = async () => {
      // Strategy 1: Immediate iframe check (synchronous - highest priority)
      if (typeof window !== "undefined") {
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          console.log("🔗 [useFrameReady] Iframe detected - Mini app context detected");
          setIsFrameReady(true);
          hasSetRef.current = true;
          return;
        }
      }

      // Strategy 2: Check Farcaster SDK (async)
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          console.log("🔗 [useFrameReady] Farcaster mini app detected");
          setIsFrameReady(true);
          hasSetRef.current = true;
          return;
        }
      } catch {
        // Not in Farcaster environment, continue
        console.log("ℹ️ [useFrameReady] Not in Farcaster environment");
      }
    };

    initialize();
  }, []);

  return { isFrameReady };
}
