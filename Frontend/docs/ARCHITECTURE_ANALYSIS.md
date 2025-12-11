# Frontend Architecture Analysis & Recommendations

## Current Architecture Overview

### Component Hierarchy
```
RootLayout (layout.tsx)
├── Providers (providers.tsx)
│   └── OnchainKitProvider (with autoConnect: true)
│       └── SafeArea
│           └── ToastProvider
│               └── ConditionalLayout
│                   └── page.tsx (HomePage)
│                       └── DRVNDashboard
```

### Initialization Flow Issues

#### 1. **Multiple Frame Ready Setters** (Race Condition Risk)
- **ConditionalLayout**: Sets frame ready when `isInMiniApp` is true
- **page.tsx**: Also sets frame ready as fallback
- **Problem**: Both run in `useEffect`, creating potential race conditions

#### 2. **Detection Method Duplication**
- **OnchainKit**: `useIsInMiniApp()` hook
- **Farcaster SDK**: `sdk.isInMiniApp()` in `useMiniAppContext`
- **Problem**: Two async detection methods, timing inconsistencies

#### 3. **Auto-Connect Timing**
- OnchainKitProvider initializes with `autoConnect: true`
- Frame ready might not be set before auto-connect attempts
- **Problem**: Auto-connect requires frame ready, but timing is uncertain

#### 4. **Hook Dependencies**
```
DRVNDashboard
├── useFarcasterSDK() - Calls sdk.actions.ready()
├── useAutoWalletAuth() - Depends on useAccount() + detection
├── useMiniKitNavigation() - Depends on useMiniKit()
├── useOptimizedOnboarding() - Depends on context
└── useMiniAppContext() - Async Farcaster SDK detection
```
**Problem**: Multiple hooks initializing in parallel, potential race conditions

## Recommendations

### 1. **Centralize Frame Ready Logic**

**Create a single source of truth for frame readiness:**

```typescript
// hooks/useFrameReady.ts
"use client";
import { useEffect, useRef } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";

export function useFrameReady() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const hasSetRef = useRef(false);

  useEffect(() => {
    if (hasSetRef.current || isFrameReady) return;

    const initialize = async () => {
      // Strategy 1: Immediate iframe check (synchronous)
      if (typeof window !== "undefined") {
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          console.log("🔗 [useFrameReady] Iframe detected - setting frame ready");
          setFrameReady();
          hasSetRef.current = true;
          return;
        }
      }

      // Strategy 2: Check Farcaster SDK (async)
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          console.log("🔗 [useFrameReady] Farcaster mini app detected");
          setFrameReady();
          hasSetRef.current = true;
          return;
        }
      } catch (error) {
        // Not in Farcaster, continue to OnchainKit check
      }

      // Strategy 3: OnchainKit context check
      // This will be handled by ConditionalLayout watching context
    };

    initialize();
  }, [setFrameReady, isFrameReady]);

  return { isFrameReady };
}
```

### 2. **Simplify ConditionalLayout**

**Make it a pure wrapper that only sets frame ready:**

```typescript
// app/components/layout/ConditionalLayout.tsx
"use client";
import { ReactNode } from "react";
import { useFrameReady } from "@/hooks/useFrameReady";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  // Just ensure frame ready is set
  useFrameReady();
  
  return <>{children}</>;
}
```

### 3. **Consolidate Detection Logic**

**Create a unified detection hook:**

```typescript
// hooks/useUnifiedMiniAppDetection.ts
"use client";
import { useState, useEffect } from "react";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";

export function useUnifiedMiniAppDetection() {
  const { isInMiniApp: isInMiniAppOnchainKit } = useIsInMiniApp();
  const [isInMiniAppFarcaster, setIsInMiniAppFarcaster] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        const status = await sdk.isInMiniApp();
        setIsInMiniAppFarcaster(status);
      } catch {
        setIsInMiniAppFarcaster(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkFarcaster();
  }, []);

  const isInMiniApp = isInMiniAppOnchainKit === true || isInMiniAppFarcaster === true;

  return {
    isInMiniApp,
    isInMiniAppOnchainKit,
    isInMiniAppFarcaster,
    isLoading,
  };
}
```

### 4. **Fix Auto-Connect Timing**

**Ensure frame ready is set BEFORE OnchainKitProvider initializes:**

```typescript
// app/providers.tsx - Add early frame ready detection
"use client";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function Providers({ children }: { children: ReactNode }) {
  const { setFrameReady } = useMiniKit();

  // Set frame ready IMMEDIATELY if in iframe (before OnchainKitProvider renders)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        console.log("🔗 [Providers] Early iframe detection - setting frame ready");
        setFrameReady();
      }
    }
  }, [setFrameReady]);

  // ... rest of provider setup
}
```

**OR** better: Move frame ready logic to a script tag in layout.tsx:

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Set frame ready immediately if in iframe
                if (window.self !== window.top) {
                  window.__FRAME_READY_DETECTED__ = true;
                }
              `,
            }}
          />
        </head>
        <body>
          {/* ... */}
        </body>
      </html>
    </Providers>
  );
}
```

### 5. **Optimize Hook Initialization Order**

**Create an initialization hook that coordinates everything:**

```typescript
// hooks/useAppInitialization.ts
"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import { useUnifiedMiniAppDetection } from "./useUnifiedMiniAppDetection";
import { sdk } from "@farcaster/miniapp-sdk";

export function useAppInitialization() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const { isInMiniApp } = useUnifiedMiniAppDetection();
  const { isConnected, address } = useAccount();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Step 1: Dismiss Farcaster splash screen
      try {
        await sdk.actions.ready();
        console.log("✅ Farcaster SDK ready");
      } catch {
        // Not in Farcaster
      }

      // Step 2: Set frame ready if in mini app
      if (isInMiniApp && !isFrameReady) {
        setFrameReady();
      }

      // Step 3: Mark as initialized
      setInitialized(true);
    };

    init();
  }, [isInMiniApp, isFrameReady, setFrameReady]);

  return {
    initialized,
    isInMiniApp,
    isFrameReady,
    isConnected,
    address,
    context,
  };
}
```

### 6. **Simplify page.tsx**

**Remove duplicate frame ready logic:**

```typescript
// app/page.tsx
"use client";
import { DRVNDashboard } from "./components/DRVNDashboard";
import { useAppInitialization } from "@/hooks/useAppInitialization";

export default function HomePage() {
  const { initialized, isInMiniApp, context } = useAppInitialization();

  if (!initialized || (isInMiniApp && !context)) {
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
      <main className="flex-1">
        <DRVNDashboard />
      </main>
    </div>
  );
}
```

## Implementation Priority

### Phase 1: Critical Fixes (Do First)
1. ✅ Revert ConditionalLayout to simple version (DONE)
2. Add early iframe detection in Providers or layout.tsx
3. Consolidate frame ready logic to single hook

### Phase 2: Optimization
4. Create unified detection hook
5. Create app initialization hook
6. Simplify page.tsx

### Phase 3: Cleanup
7. Remove duplicate detection logic
8. Consolidate all hooks
9. Add comprehensive error handling

## Key Principles

1. **Single Responsibility**: Each hook/component does one thing
2. **Early Detection**: Detect mini app as early as possible (iframe check)
3. **Single Source of Truth**: One place sets frame ready
4. **Proper Ordering**: Initialize in correct sequence
5. **Error Handling**: Graceful fallbacks at each step

## Testing Checklist

- [ ] Frame ready set before auto-connect attempts
- [ ] Auto-connect works in Base App
- [ ] Auto-connect works in Farcaster mini app
- [ ] Auto-connect works on web/desktop (manual)
- [ ] No duplicate frame ready calls
- [ ] No race conditions
- [ ] Proper loading states
- [ ] Error handling works
