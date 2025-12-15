# Mini App Initialization Flow

This document explains how the app properly initializes across all platforms: Base App, Farcaster, Web/Desktop, and Mobile Browser.

## Platform Detection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    App Starts                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         OnchainKitProvider Initializes                       │
│  - Configures Wagmi with Base Account connectors             │
│  - Sets up auto-connect (smartWalletOnly)                    │
│  - Enables MiniKit features                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         ConditionalLayout (layout.tsx)                       │
│  - Detects mini app via useMiniKit()                         │
│  - Sets frame ready for auto-connect                         │
│  - Logs connection status                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         page.tsx (HomePage)                                  │
│  - Calls setFrameReady() when in mini app                    │
│  - Waits for context to load                                 │
│  - Shows loading state if context not ready                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         DRVNDashboard                                        │
│  - useFarcasterSDK() - Calls ready() to dismiss splash      │
│  - useAutoWalletAuth() - Checks user account                │
│  - useMiniAppContext() - Gets Farcaster context             │
│  - useOptimizedOnboarding() - Handles onboarding flow        │
└─────────────────────────────────────────────────────────────┘
```

## Platform Detection

### Base App Detection
- **Client FID**: `309857` (per Base docs)
- **Detection**: `context.client.clientFid === 309857`
- **Hook**: `useBaseAppDetection()` or `useUnifiedMiniAppContext()`

### Farcaster Detection
- **Any mini app that's NOT Base App**
- **Detection**: `isInMiniApp && !isBaseApp`
- **Hook**: `useMiniAppContext()` or `useUnifiedMiniAppContext()`

### Web/Desktop Detection
- **Not in mini app**: `!isInMiniApp`
- **Hook**: `useUnifiedMiniAppContext()` returns `isWeb: true`

## Hook Usage Guide

### Recommended: `useUnifiedMiniAppContext()`
**Use this for comprehensive context across all platforms:**

```typescript
import { useUnifiedMiniAppContext } from "@/hooks/useUnifiedMiniAppContext";

function MyComponent() {
  const {
    isInMiniApp,
    isBaseApp,        // Base App specific
    isFarcaster,      // Farcaster specific
    isWeb,            // Web/Desktop browser
    platformType,     // "web" | "mobile"
    user,             // User profile data
    clientFid,        // 309857 for Base App
    contextReady,     // Context loaded
    loading,          // Still loading
  } = useUnifiedMiniAppContext();

  if (isBaseApp) {
    // Base App specific features
  } else if (isFarcaster) {
    // Farcaster specific features
  } else {
    // Web/Desktop browser
  }
}
```

### Alternative: Individual Hooks

**For Base App detection only:**
```typescript
import { useBaseAppDetection } from "@/hooks/useBaseAppDetection";
const { isBaseApp, clientFid } = useBaseAppDetection();
```

**For Farcaster context only:**
```typescript
import { useMiniAppContext } from "@/hooks/useMiniAppContext";
const { user, isInMiniApp } = useMiniAppContext();
```

**For OnchainKit context:**
```typescript
import { useMiniKit } from "@coinbase/onchainkit/minikit";
const { context, isFrameReady, setFrameReady } = useMiniKit();
```

## Initialization Checklist

### ✅ Required Initialization Steps

1. **OnchainKitProvider** (`providers.tsx`)
   - ✅ `miniKit.enabled: true`
   - ✅ `preference: "smartWalletOnly"` (for Base mini apps)
   - ✅ `autoConnect: true`

2. **Frame Readiness** (`page.tsx` or `ConditionalLayout.tsx`)
   - ✅ Call `setFrameReady()` when `isInMiniApp && !isFrameReady`
   - ✅ This enables auto-connect to Base Account

3. **Farcaster SDK** (`useFarcasterSDK()`)
   - ✅ Call `sdk.actions.ready()` to dismiss splash screen
   - ✅ Called in `DRVNDashboard` component

4. **Context Loading**
   - ✅ Wait for `context` to be available before rendering
   - ✅ Show loading state if `isInMiniApp && !context`

## Platform-Specific Behavior

### Base App (clientFid: 309857)
- ✅ Auto-connects to Base Account (Smart Wallet)
- ✅ Uses `smartWalletOnly` preference
- ✅ No EIP-6963 wallet discovery
- ✅ Full Base Account features (gasless, batch, etc.)

### Farcaster
- ✅ Auto-connects to Base Account via Farcaster connector
- ✅ Uses Farcaster user context
- ✅ Supports all Farcaster SDK features

### Web/Desktop Browser
- ✅ Manual wallet connection required
- ✅ Uses `preference: "all"` (if not in mini app)
- ✅ Standard web wallet flow

### Mobile Browser
- ✅ Same as Web/Desktop
- ✅ Responsive UI based on screen size

## Current Implementation Status

### ✅ Working Correctly
- OnchainKitProvider configuration
- Frame readiness handling
- Auto-connect setup
- Base App detection (via useBaseAppDetection)
- Farcaster context access
- Web/Desktop fallback

### 🔄 Can Be Optimized
- Consider using `useUnifiedMiniAppContext()` instead of multiple hooks
- Consolidate context access to single source of truth
- Add explicit Base App vs Farcaster feature flags

## Testing Checklist

- [ ] Base App: Auto-connects wallet
- [ ] Base App: Shows Base Account address
- [ ] Farcaster: Auto-connects wallet
- [ ] Farcaster: Shows Farcaster user profile
- [ ] Web: Manual wallet connection works
- [ ] Web: All wallet types available
- [ ] Mobile: Responsive UI works
- [ ] All platforms: Context loads correctly
- [ ] All platforms: No console errors
