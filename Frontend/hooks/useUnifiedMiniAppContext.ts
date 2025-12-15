"use client";

import { useEffect, useState, useMemo } from "react";
import { useMiniKit, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";

/**
 * Unified Mini App Context Hook
 * 
 * Combines OnchainKit's useMiniKit with Farcaster SDK to provide:
 * - Base App detection (clientFid === 309857)
 * - Farcaster detection
 * - Web/desktop/mobile detection
 * - User context from both sources
 * - Proper initialization state
 * 
 * This hook ensures proper detection across all platforms:
 * - Base App (Base mini app)
 * - Farcaster (Farcaster mini app)
 * - Web/Desktop browser
 * - Mobile browser
 */
export type UnifiedMiniAppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
};

export type PlatformType = "web" | "mobile";

export interface UnifiedMiniAppContext {
  // Platform detection
  isInMiniApp: boolean;
  isBaseApp: boolean;
  isFarcaster: boolean;
  isWeb: boolean;
  platformType: PlatformType | null;
  
  // User data (prioritizes OnchainKit context, falls back to Farcaster SDK)
  user: UnifiedMiniAppUser | null;
  
  // Client context
  clientFid: number | null;
  clientContext: {
    platformType?: PlatformType;
    clientFid?: number;
    added?: boolean;
    safeAreaInsets?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  } | null;
  
  // Location context
  location: {
    type?: string;
    [key: string]: unknown;
  } | null;
  
  // Features
  features: {
    haptics: boolean;
    cameraAndMicrophoneAccess?: boolean;
  } | null;
  
  // Loading states
  loading: boolean;
  contextReady: boolean;
  
  // Error state
  error: Error | null;
}

export function useUnifiedMiniAppContext(): UnifiedMiniAppContext {
  // OnchainKit hooks (works for both Base App and Farcaster)
  const { context: onchainKitContext, isFrameReady, setFrameReady } = useMiniKit();
  const { isInMiniApp: isInMiniAppOnchainKit } = useIsInMiniApp();
  const { address, isConnected } = useAccount();
  
  // Farcaster SDK state (fallback/direct access)
  const [farcasterContext, setFarcasterContext] = useState<{
    user: UnifiedMiniAppUser | null;
    platformType: PlatformType | null;
  } | null>(null);
  const [isInMiniAppFarcaster, setIsInMiniAppFarcaster] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Farcaster SDK context (as fallback/complement to OnchainKit)
  useEffect(() => {
    const loadFarcasterContext = async () => {
      try {
        // Check Farcaster SDK directly
        const farcasterStatus = await sdk.isInMiniApp();
        setIsInMiniAppFarcaster(farcasterStatus);

        if (farcasterStatus) {
          const farcasterCtx = await sdk.context;
          setFarcasterContext({
            user: {
              fid: farcasterCtx.user.fid,
              username: farcasterCtx.user.username,
              displayName: farcasterCtx.user.displayName,
              pfpUrl: farcasterCtx.user.pfpUrl,
              // Note: bio is not available in Farcaster SDK UserContext type
            },
            platformType: farcasterCtx.client?.platformType || null,
          });
        }
      } catch (err) {
        console.error("Error loading Farcaster context:", err);
        setError(err instanceof Error ? err : new Error("Failed to load Farcaster context"));
      } finally {
        setLoading(false);
      }
    };

    loadFarcasterContext();
  }, []);

  // Ensure frame is ready for auto-connect
  useEffect(() => {
    if (isInMiniAppOnchainKit && !isFrameReady) {
      console.log("🔗 Mini app detected - Setting frame ready for auto-connect");
      setFrameReady();
    }
  }, [isInMiniAppOnchainKit, isFrameReady, setFrameReady]);

  // Compute unified context
  const unifiedContext = useMemo((): UnifiedMiniAppContext => {
    // Determine if we're in a mini app (OnchainKit is authoritative)
    const isInMiniApp = isInMiniAppOnchainKit ?? isInMiniAppFarcaster ?? false;
    
    // Detect Base App (clientFid === 309857)
    const isBaseApp = onchainKitContext?.client?.clientFid === 309857;
    
    // Detect Farcaster (any mini app that's not Base App)
    const isFarcaster = isInMiniApp && !isBaseApp;
    
    // Determine platform type
    const platformType: PlatformType | null = 
      onchainKitContext?.client?.platformType || 
      farcasterContext?.platformType || 
      null;
    
    // Determine if web (not in mini app)
    const isWeb = !isInMiniApp;
    
    // Prioritize OnchainKit context user, fallback to Farcaster SDK
    const user: UnifiedMiniAppUser | null = 
      onchainKitContext?.user 
        ? {
            fid: onchainKitContext.user.fid,
            username: onchainKitContext.user.username,
            displayName: onchainKitContext.user.displayName,
            pfpUrl: onchainKitContext.user.pfpUrl,
            // Note: bio is not available in OnchainKit UserContext type
          }
        : farcasterContext?.user || null;
    
    // Context is ready when we have either OnchainKit or Farcaster context
    const contextReady = !!onchainKitContext || !!farcasterContext;

    return {
      isInMiniApp,
      isBaseApp,
      isFarcaster,
      isWeb,
      platformType,
      user,
      clientFid: onchainKitContext?.client?.clientFid || null,
      clientContext: onchainKitContext?.client || null,
      location: onchainKitContext?.location || null,
      features: onchainKitContext?.features || null,
      loading: loading && !contextReady,
      contextReady,
      error,
    };
  }, [
    isInMiniAppOnchainKit,
    isInMiniAppFarcaster,
    onchainKitContext,
    farcasterContext,
    loading,
    error,
  ]);

  // Debug logging
  useEffect(() => {
    if (unifiedContext.contextReady) {
      console.log("🔗 Unified Mini App Context:", {
        isInMiniApp: unifiedContext.isInMiniApp,
        isBaseApp: unifiedContext.isBaseApp,
        isFarcaster: unifiedContext.isFarcaster,
        isWeb: unifiedContext.isWeb,
        platformType: unifiedContext.platformType,
        clientFid: unifiedContext.clientFid,
        hasUser: !!unifiedContext.user,
        userFid: unifiedContext.user?.fid,
        isConnected,
        address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
      });
    }
  }, [unifiedContext, isConnected, address]);

  return unifiedContext;
}
