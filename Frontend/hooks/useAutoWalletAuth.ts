"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useUnifiedMiniAppDetection } from "./useUnifiedMiniAppDetection";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  xHandle?: string;
  profileImage?: string;
  walletAddress: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface AutoWalletAuthState {
  isChecking: boolean;
  userExists: boolean | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  shouldShowSignup: boolean;
  error: string | null;
}

export function useAutoWalletAuth() {
  const { address, isConnected } = useAccount();
  const { isInMiniApp } = useUnifiedMiniAppDetection();
  
  const [state, setState] = useState<AutoWalletAuthState>({
    isChecking: false,
    userExists: null,
    currentUser: null,
    isAuthenticated: false,
    shouldShowSignup: false,
    error: null,
  });

  // Debug mini app detection
  useEffect(() => {
    if (isInMiniApp) {
      console.log("🔗 Mini app detected for auto sign-in");
    }
  }, [isInMiniApp]);

  const checkUserAccount = useCallback(async () => {
    if (!address || !isConnected) {
      setState((prev) => ({
        ...prev,
        isChecking: false,
        userExists: null,
        currentUser: null,
        isAuthenticated: false,
        shouldShowSignup: false,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      // First check if user exists
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        if (checkData.exists) {
          // User exists - in mini apps, auto sign them in
          // In web/desktop, they still need to manually sign in
          // Check if we're in a mini app (Base App or Farcaster)
          if (isInMiniApp === true) {
            // Auto sign-in for mini apps
            try {
              const signinResponse = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ walletAddress: address }),
              });

              if (signinResponse.ok) {
                // Sign-in successful, fetch user profile
                const userResponse = await fetch("/api/auth/user", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ walletAddress: address }),
                });

                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  setState((prev) => ({
                    ...prev,
                    isChecking: false,
                    userExists: true,
                    currentUser: userData.user,
                    isAuthenticated: true,
                    shouldShowSignup: false,
                    error: null,
                  }));
                  console.log("✅ Auto sign-in successful in mini app");
                } else {
                  setState((prev) => ({
                    ...prev,
                    isChecking: false,
                    userExists: true,
                    currentUser: null,
                    isAuthenticated: false,
                    shouldShowSignup: false,
                    error: "Failed to fetch user profile after sign-in",
                  }));
                }
              } else {
                // Sign-in failed
                const signinData = await signinResponse.json();
                console.error("Auto sign-in failed:", signinData.error);
                setState((prev) => ({
                  ...prev,
                  isChecking: false,
                  userExists: true,
                  currentUser: null,
                  isAuthenticated: false,
                  shouldShowSignup: false,
                  error: signinData.error || "Failed to auto sign-in",
                }));
              }
            } catch (signinError) {
              console.error("Error during auto sign-in:", signinError);
              setState((prev) => ({
                ...prev,
                isChecking: false,
                userExists: true,
                currentUser: null,
                isAuthenticated: false,
                shouldShowSignup: false,
                error: "Failed to auto sign-in",
              }));
            }
          } else {
            // Web/Desktop - just fetch user profile, don't auto sign-in
            const userResponse = await fetch("/api/auth/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ walletAddress: address }),
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              setState((prev) => ({
                ...prev,
                isChecking: false,
                userExists: true,
                currentUser: userData.user,
                isAuthenticated: true,
                shouldShowSignup: false,
                error: null,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                isChecking: false,
                userExists: true,
                currentUser: null,
                isAuthenticated: false,
                shouldShowSignup: false,
                error: "Failed to fetch user profile",
              }));
            }
          }
        } else {
          // User doesn't exist, should show signup
          setState((prev) => ({
            ...prev,
            isChecking: false,
            userExists: false,
            currentUser: null,
            isAuthenticated: false,
            shouldShowSignup: true,
            error: null,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          isChecking: false,
          userExists: null,
          currentUser: null,
          isAuthenticated: false,
          shouldShowSignup: false,
          error: "Failed to check user account",
        }));
      }
    } catch (error) {
      console.error("Error checking user account:", error);
      setState((prev) => ({
        ...prev,
        isChecking: false,
        userExists: null,
        currentUser: null,
        isAuthenticated: false,
        shouldShowSignup: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [address, isConnected, isInMiniApp]);

  const handleSignupSuccess = useCallback(() => {
    // Refresh user data after successful signup
    checkUserAccount();
  }, [checkUserAccount]);

  const handleSigninSuccess = useCallback(() => {
    // Refresh user data after successful signin
    checkUserAccount();
  }, [checkUserAccount]);

  const resetAuthState = useCallback(() => {
    setState({
      isChecking: false,
      userExists: null,
      currentUser: null,
      isAuthenticated: false,
      shouldShowSignup: false,
      error: null,
    });
  }, []);

  // Auto-check when wallet connects
  // In mini apps, this will trigger auto sign-in if user exists
  useEffect(() => {
    if (isConnected && address) {
      // Small delay to ensure isInMiniApp is determined
      // This is especially important for mini apps where detection might be async
      const timer = setTimeout(() => {
        checkUserAccount();
      }, 200); // Increased delay to ensure both detection methods have run
      return () => clearTimeout(timer);
    } else {
      resetAuthState();
    }
  }, [isConnected, address, checkUserAccount, resetAuthState, isInMiniApp]);

  return {
    ...state,
    checkUserAccount,
    handleSignupSuccess,
    handleSigninSuccess,
    resetAuthState,
  };
}
