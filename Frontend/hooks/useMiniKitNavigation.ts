"use client";

/**
 * useMiniKitNavigation - Navigation helpers for mini apps
 * 
 * Provides fallbacks when MiniKit is not enabled, so the app works
 * in both mini app and web/desktop contexts.
 * 
 * IMPORTANT: When MiniKit is disabled in OnchainKitProvider, this hook
 * will use browser fallbacks for all navigation functions.
 */
export function useMiniKitNavigation() {
  // Since MiniKit hooks throw errors when MiniKit is disabled,
  // and React hooks must be called unconditionally, we provide
  // fallback implementations that work in all contexts
  
  const handleExternalLink = (url: string) => {
    // Always use browser fallback when MiniKit is disabled
    window.open(url, "_blank");
  };

  const handleShare = (text: string, url?: string) => {
    try {
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: "DRVN/VHCLS",
          text,
          url: url || window.location.href,
        });
      } else {
        // Copy to clipboard fallback
        navigator.clipboard.writeText(url || window.location.href);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard
      navigator.clipboard.writeText(url || window.location.href);
    }
  };

  const handleViewProfile = (fid: number) => {
    // Always use browser fallback when MiniKit is disabled
    window.open(`https://warpcast.com/${fid}`, "_blank");
  };

  return {
    handleExternalLink,
    handleShare,
    handleViewProfile,
    openUrl: null,
    composeCast: null,
    viewProfile: null,
  };
}
