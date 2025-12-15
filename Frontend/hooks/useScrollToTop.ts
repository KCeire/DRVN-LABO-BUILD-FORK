"use client";

import { useCallback } from "react";

// Advanced scroll-to-top hook that handles complex CSS layouts
// This was extensively tested and debugged to work with Tailwind overflow classes
// Solves the problem where standard window.scrollTo(0, 0) doesn't work with CSS containers

export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Find scrollable elements and scroll them to top
      // These selectors target common Tailwind/CSS patterns that create scrollable containers
      const scrollableSelectors = [
        '.overflow-auto',
        '.overflow-y-auto',
        '.overflow-scroll',
        '.overflow-y-scroll',
        'main',
        '.min-h-screen',
        '.space-y-6'
      ];

      // Check each possible scrollable container
      // This comprehensive approach ensures we catch containers that might have scroll content
      scrollableSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (element instanceof HTMLElement && element.scrollTop > 0) {
              element.scrollTo(0, 0);
              element.scrollTop = 0;
            }
          });
        } catch {
          // Silently continue if selector fails - some selectors might not exist
        }
      });

      // Standard scroll methods as fallback
      // These handle basic page-level scrolling
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return { scrollToTop };
}

// Enhanced version with timing control for React state updates
export function useScrollToTopWithDelay() {
  const { scrollToTop } = useScrollToTop();

  const scrollToTopDelayed = useCallback((delay: number = 0) => {
    if (delay > 0) {
      setTimeout(scrollToTop, delay);
    } else {
      scrollToTop();
    }
  }, [scrollToTop]);

  const scrollToTopAfterStateUpdate = useCallback(() => {
    // Use requestAnimationFrame to ensure scroll happens after React state updates
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }, [scrollToTop]);

  return {
    scrollToTop,
    scrollToTopDelayed,
    scrollToTopAfterStateUpdate
  };
}

// Usage Notes:
// 1. useScrollToTop() - Basic version for immediate scrolling
// 2. useScrollToTopWithDelay() - Advanced version with timing control
// 3. This solves mobile navigation scroll issues where changing routes/tabs
//    doesn't automatically scroll to top due to CSS container layouts
// 4. Tested extensively with DRVN app's Tailwind CSS structure