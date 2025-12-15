"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

/**
 * Base App Detection Hook
 * 
 * Detects if the app is running in the Base App (not Farcaster).
 * Base App has clientFid === 309857
 * 
 * @see https://docs.base.org/mini-apps/troubleshooting/base-app-compatibility
 * 
 * Note: For comprehensive context, use useUnifiedMiniAppContext instead
 */
export function useBaseAppDetection() {
  const { context } = useMiniKit();

  // Base App client FID is 309857 (per Base docs)
  const isBaseApp = context?.client?.clientFid === 309857;

  return {
    isBaseApp,
    context,
    clientFid: context?.client?.clientFid,
  };
}
