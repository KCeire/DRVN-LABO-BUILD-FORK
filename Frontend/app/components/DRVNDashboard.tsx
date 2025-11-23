"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { MarketplaceCard, marketplaceItems } from "./ui/marketplace-card";
import { TopStoriesSection } from "./ui/top-stories-section";
import {
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Menu,
  // TrendingUp,
  Settings as SettingsIcon,
  Coins,
  Car,
  Tag,
  Gamepad2,
  Bookmark,
  Plus,
  BarChart,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { BsSpeedometer2 } from "react-icons/bs";
import { RxDiscordLogo } from "react-icons/rx";
import { RiNewsFill } from "react-icons/ri";
import { AuthChoiceModal } from "./modals/auth-choice-modal";
import { AutoSignupModal } from "./modals/auto-signup-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useAccount } from "wagmi";
import { DRVNPortfolio } from "./DRVNPortfolio";
import { Settings } from "./Settings";
import { Buster } from "./Buster";
import { Garage } from "./Garage";
import { useFarcasterSDK } from "../../hooks/useFarcasterSDK";
import { useAutoWalletAuth } from "../../hooks/useAutoWalletAuth";
import { useMiniKitNavigation } from "../../hooks/useMiniKitNavigation";
import { useOptimizedOnboarding } from "../../hooks/useOptimizedOnboarding";
// import { ImmediateValueDisplay } from "./ImmediateValueDisplay";
import { ProgressiveActionButton } from "./ProgressiveActionButton";
import { ConnectButton } from "./web3/ConnectButton";
import TotalKeysMinted from "./web3/TotalKeysMinted";
import { HeroHeader } from "./ui/hero-header";

export function DRVNDashboard() {
  const { address } = useAccount();
  const [showNotification, setShowNotification] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [activePage, setActivePage] = useState("dashboard");
  const [arcadeTab, setArcadeTab] = useState("dashboard");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Initialize Farcaster SDK
  useFarcasterSDK();

  // Auto wallet authentication
  const {
    currentUser,
    isAuthenticated,
    shouldShowSignup,
    handleSignupSuccess,
    handleSigninSuccess,
  } = useAutoWalletAuth();

  // Base App detection and navigation
  const { handleExternalLink, handleShare } = useMiniKitNavigation();

  // Optimized onboarding
  const { canAccessProtectedFeature, isLoading: isContextLoading } =
    useOptimizedOnboarding();

  // Auto-show signup modal if user doesn't exist
  useEffect(() => {
    if (shouldShowSignup && !showAuthModal) {
      setShowAuthModal(true);
    }
  }, [shouldShowSignup, showAuthModal]);

  // Listen for custom events from ProgressiveActionButton
  useEffect(() => {
    const handleShowAuthModal = () => {
      setShowAuthModal(true);
    };

    const handleConnectWallet = () => {
      // This will be handled by the ConnectButton component
      console.log("Wallet connection requested");
    };

    window.addEventListener("showAuthModal", handleShowAuthModal);
    window.addEventListener("connectWallet", handleConnectWallet);

    return () => {
      window.removeEventListener("showAuthModal", handleShowAuthModal);
      window.removeEventListener("connectWallet", handleConnectWallet);
    };
  }, []);

  // Disable pull-to-refresh prevention temporarily to test scrolling
  // useEffect(() => {
  //   // Pull-to-refresh prevention disabled for testing
  // }, []);

  // Handle mobile menu swipe to close
  useEffect(() => {
    if (!mobileMenuOpen) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      startX = touchEvent.touches[0].clientX;
      startY = touchEvent.touches[0].clientY;
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      const currentX = touchEvent.touches[0].clientX;
      const currentY = touchEvent.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // If user swipes left (closing gesture) and it's a horizontal swipe
      if (deltaX < -50 && Math.abs(deltaY) < Math.abs(deltaX)) {
        setMobileMenuOpen(false);
      }
    };

    // Add touch event listeners to the mobile sidebar
    const mobileSidebar = document.querySelector("[data-mobile-sidebar]");
    if (mobileSidebar) {
      mobileSidebar.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      mobileSidebar.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }

    return () => {
      if (mobileSidebar) {
        mobileSidebar.removeEventListener("touchstart", handleTouchStart);
        mobileSidebar.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [mobileMenuOpen]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const nextCar = () => {
    setCurrentCarIndex((prev) => (prev + 1) % marketplaceItems.length);
  };

  const prevCar = () => {
    setCurrentCarIndex(
      (prev) => (prev - 1 + marketplaceItems.length) % marketplaceItems.length,
    );
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCar();
    }
    if (isRightSwipe) {
      prevCar();
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setMobileMenuOpen(false); // Close mobile menu when opening auth modal
  };

  const navigationItems = [
    {
      icon: BsSpeedometer2,
      label: "Dashboard",
      id: "dashboard",
      isGreen: true,
    },
    { icon: RiNewsFill, label: "DRVN Culture", id: "culture", isGreen: true },
    {
      icon: Gamepad2,
      label: "Arcade",
      id: "arcade",
      isGreen: true,
    },
    {
      icon: Tag,
      label: "Marketplace",
      id: "marketplace",
      isGreen: true,
    },
    {
      icon: Car,
      label: "Garage",
      id: "garage",
      isGreen: true,
      requiresAuth: true,
    },
    {
      icon: Coins,
      label: "Buster Club",
      id: "buster-club",
      isGreen: true,
      requiresAuth: true,
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      id: "settings",
      isGreen: true,
      requiresAuth: true,
    },
    {
      icon: FaXTwitter,
      label: "X/Twitter",
      id: "twitter",
      isGreen: false,
      externalUrl: "https://x.com/drvnlabo",
    },
    {
      icon: RxDiscordLogo,
      label: "Discord",
      id: "discord",
      isGreen: false,
      externalUrl: "https://discord.com/invite/GBru58gZmj",
    },
  ];

  const renderPageContent = () => {
    // Show loading state if context is still loading
    if (isContextLoading) {
      return (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00daa2] mx-auto mb-4"></div>
            <p className="text-gray-300 text-sm font-sans">
              Loading DRVN VHCLS...
            </p>
          </div>
        </div>
      );
    }

    // Use progressive disclosure instead of blocking access
    const canAccessPage = (page: string) => {
      switch (page) {
        case "garage":
        case "settings":
          return canAccessProtectedFeature("garage");
        case "buster-club":
          return canAccessProtectedFeature("trading");
        default:
          return true;
      }
    };

    // Show progressive disclosure for protected pages
    if (!canAccessPage(activePage)) {
      const pageInfo = {
        garage: {
          title: "Your Garage",
          description: "View and manage your car collection",
        },
        settings: {
          title: "Settings",
          description: "Customize your DRVN VHCLS experience",
        },
        "buster-club": {
          title: "Buster Club",
          description: "Trade BSTR tokens and access exclusive features",
        },
      };

      const info = pageInfo[activePage as keyof typeof pageInfo];

      return (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-[#00daa2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{info?.title}</h2>
            <p className="text-gray-400 mb-6 font-sans">{info?.description}</p>
            <ProgressiveActionButton
              actionType="personalize"
              feature={activePage === "buster-club" ? "trading" : "garage"}
              onClick={() => {
                if (activePage === "buster-club") {
                  // Handle trading action
                } else {
                  // Handle personalization action
                }
              }}
              className="bg-[#00daa2] hover:bg-[#00b894] text-black font-mono font-semibold"
            >
              Get Started
            </ProgressiveActionButton>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Hero Section with Notification Banner */}
            <div
              className="relative rounded-2xl overflow-hidden bg-cover bg-center min-h-[300px] md:min-h-[400px] flex flex-col justify-center p-4 md:p-8"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/Cars/GtrHero1.jpg')",
              }}
            >
              {/* Content */}
              <div className="relative z-10 text-white space-y-4 max-w-2xl -mt-8 mb-20 md:mb-24">
                <h1 className="text-xl md:text-4xl font-bold font-mono">
                  {isAuthenticated && currentUser
                    ? `Welcome back, ${currentUser.username || `${currentUser.firstName} ${currentUser.lastName}`}!`
                    : "Welcome to DRVN VHCLS!"}
                </h1>
                <p className="text-sm md:text-xl text-gray-300 font-sans">
                  Explore exclusive car collections and trade on Base.
                </p>
              </div>

              {/* Notification Banner - Positioned inside hero */}
              {showNotification && (
                <div className="absolute bottom-1 md:bottom-4 left-4 md:left-8 right-4 md:right-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-red-500 rounded-lg p-3 md:p-4 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-400 text-xs md:text-sm mb-1 font-sans">
                        08/27/2025
                      </div>
                      <div className="text-red-500 font-semibold mb-1 text-xs md:text-sm font-mono">
                        DRVN/VHCLS V0.1.1 is here!
                      </div>
                      <div className="text-gray-300 text-xs md:text-sm font-sans">
                        You&apos;re looking at a fresh build with improved
                        onboarding, Founder&apos;s Club Key minting, and easier
                        $BSTR trading. Plus, DRVN/VHCLS is now available as a
                        mini-app right inside Farcaster & the Base app. LFG
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotification(false)}
                      className="text-red-500 hover:text-red-300 shrink-0 border border-red-500 rounded-full size-5"
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Immediate Value Display */}
            {/* <ImmediateValueDisplay 
              onNavigateToMarketplace={() => setActivePage("marketplace")}
              onNavigateToGarage={() => setActivePage("garage")}
            /> */}

            {/* DRVN Portfolio - Only show if authenticated */}
            {isAuthenticated && currentUser && (
              <DRVNPortfolio
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                onNavigate={setActivePage}
              />
            )}

            <TotalKeysMinted />

            {/* Marketplace Section */}
            <section className="space-y-4 md:space-y-6 font-mono">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-lg md:text-2xl font-bold font-mono">
                  Marketplace
                </h2>
                <ProgressiveActionButton
                  actionType="explore"
                  feature="marketplace"
                  onClick={() => setActivePage("marketplace")}
                  variant="link"
                  className="text-[#00daa2] hover:text-green-300 text-sm md:text-base font-mono"
                >
                  View all
                </ProgressiveActionButton>
              </div>

              {/* Desktop Marketplace */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 z-10 w-full px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -ml-8"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -mr-5"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 px-8">
                    {marketplaceItems.map((item) => (
                      <MarketplaceCard
                        key={item.id}
                        id={item.id}
                        year={item.year}
                        brand={item.brand}
                        model={item.model}
                        collection={item.collection}
                        mv={item.mv}
                        av={item.av}
                        status={item.status}
                        price={item.price}
                        image={item.image}
                        description={item.description}
                        moreInfo={item.moreInfo}
                        specs={item.specs}
                        detailedSpecs={item.detailedSpecs}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Marketplace */}
              <div className="md:hidden">
                <div className="relative">
                  <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 z-10 w-full px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -ml-4"
                      onClick={prevCar}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -mr-4"
                      onClick={nextCar}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div
                    className="flex justify-center transition-transform duration-300 ease-in-out"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <MarketplaceCard
                      id={marketplaceItems[currentCarIndex].id}
                      year={marketplaceItems[currentCarIndex].year}
                      brand={marketplaceItems[currentCarIndex].brand}
                      model={marketplaceItems[currentCarIndex].model}
                      collection={marketplaceItems[currentCarIndex].collection}
                      mv={marketplaceItems[currentCarIndex].mv}
                      av={marketplaceItems[currentCarIndex].av}
                      status={marketplaceItems[currentCarIndex].status}
                      price={marketplaceItems[currentCarIndex].price}
                      image={marketplaceItems[currentCarIndex].image}
                      description={
                        marketplaceItems[currentCarIndex].description
                      }
                      moreInfo={marketplaceItems[currentCarIndex].moreInfo}
                      specs={marketplaceItems[currentCarIndex].specs}
                      detailedSpecs={
                        marketplaceItems[currentCarIndex].detailedSpecs
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Top Stories Section */}
            <TopStoriesSection onNavigate={setActivePage} />
          </div>
        );

      case "culture":
        return (
          <div className="space-y-6">
            <HeroHeader
              title="DRVN Culture"
              subtitle="Stay updated with the latest automotive culture and news"
              backgroundImage="/Cars/CultureHero1.jpg"
            />
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-[#00daa2] text-lg font-mono font-bold mb-3">
                Stay up-to-date on the latest news and content from across the
                automotive spectrum, IRL, online, and onchain. Original content
                coming soon.
              </h3>
            </div>
          </div>
        );

      case "marketplace":
        return (
          <div className="space-y-6">
            <HeroHeader
              title="Marketplace"
              subtitle="Discover and trade exclusive automotive collections"
              backgroundImage="/Cars/SupraHero1.jpg"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="link"
                className="text-[#00daa2] hover:text-green-300 text-sm md:text-base font-mono"
                onClick={() =>
                  handleShare(
                    "Check out the DRVN VHCLS marketplace!",
                    window.location.href,
                  )
                }
              >
                Share
              </Button>
              <Button
                variant="link"
                className="text-[#00daa2] hover:text-green-300 text-sm md:text-base font-mono"
              >
                View all
              </Button>
            </div>

            {/* Desktop Marketplace */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 z-10 w-full px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -ml-8"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -mr-5"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 px-8">
                  {marketplaceItems.map((item) => (
                    <MarketplaceCard
                      key={item.id}
                      id={item.id}
                      year={item.year}
                      brand={item.brand}
                      model={item.model}
                      collection={item.collection}
                      mv={item.mv}
                      av={item.av}
                      status={item.status}
                      price={item.price}
                      image={item.image}
                      description={item.description}
                      moreInfo={item.moreInfo}
                      specs={item.specs}
                      detailedSpecs={item.detailedSpecs}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Marketplace */}
            <div className="md:hidden">
              <div className="relative">
                <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 z-10 w-full px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -ml-4"
                    onClick={prevCar}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/80 text-[#00daa2] w-10 h-10 rounded-full border border-[#00daa2] -mr-4"
                    onClick={nextCar}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div
                  className="flex justify-center transition-transform duration-300 ease-in-out"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <MarketplaceCard
                    id={marketplaceItems[currentCarIndex].id}
                    year={marketplaceItems[currentCarIndex].year}
                    brand={marketplaceItems[currentCarIndex].brand}
                    model={marketplaceItems[currentCarIndex].model}
                    collection={marketplaceItems[currentCarIndex].collection}
                    mv={marketplaceItems[currentCarIndex].mv}
                    av={marketplaceItems[currentCarIndex].av}
                    status={marketplaceItems[currentCarIndex].status}
                    price={marketplaceItems[currentCarIndex].price}
                    image={marketplaceItems[currentCarIndex].image}
                    description={marketplaceItems[currentCarIndex].description}
                    moreInfo={marketplaceItems[currentCarIndex].moreInfo}
                    specs={marketplaceItems[currentCarIndex].specs}
                    detailedSpecs={
                      marketplaceItems[currentCarIndex].detailedSpecs
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "garage":
        return (
          <div className="space-y-6">
            <Garage
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </div>
        );

      case "buster-club":
        return (
          <div className="space-y-6">
            <Buster
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <HeroHeader
              title="Settings"
              subtitle="Customize your DRVN VHCLS experience"
              backgroundImage="/Cars/shop-hero-1.jpg"
            />
            <Settings
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </div>
        );

      case "arcade":
        // Auto-collapse sidebar for better arcade experience
        if (!sidebarCollapsed) {
          setSidebarCollapsed(true);
        }

        // Render full arcade interface within main app context
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-[#00daa2]" />
                Arcade
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('/arcade', '_blank');
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-[#00daa2]"
                >
                  Open Full Arcade
                </Button>
              </div>
            </div>

            {/* Arcade Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-900/50 border border-gray-800 rounded-lg p-1">
              <button
                onClick={() => setArcadeTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  arcadeTab === 'dashboard'
                    ? 'bg-[#00daa2] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setArcadeTab('games')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  arcadeTab === 'games'
                    ? 'bg-[#00daa2] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Games
              </button>
              <button
                onClick={() => setArcadeTab('stats')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  arcadeTab === 'stats'
                    ? 'bg-[#00daa2] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Stats
              </button>
            </div>

            {/* Arcade Content */}
            <div className="min-h-[600px]">
              {arcadeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Player Stats Widget */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 text-8xl">🎮</div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm opacity-80 font-sans">Player</p>
                          <p className="text-xl font-bold font-mono">
                            {currentUser?.username || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0x0000...0000')}
                          </p>
                        </div>
                        <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                          <div className="text-center">
                            <p className="text-xs font-semibold">LEVEL</p>
                            <p className="text-2xl font-bold">12</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-mono">2,450 XP</span>
                          <span className="font-mono">3,000 XP</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div className="bg-white rounded-full h-3" style={{ width: '82%' }}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>🏆</span>
                          <span>8 / 15 Achievements</span>
                        </div>
                        <div className="text-right">
                          <span className="opacity-80">Total: </span>
                          <span className="font-mono font-bold">12,450 XP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Game Banner */}
                  <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-8 right-8 text-6xl">🏁</div>
                      <div className="absolute bottom-4 left-4 text-4xl opacity-50">🏎️</div>
                    </div>

                    <div className="relative z-10">
                      <div className="inline-block bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                        FEATURED GAME • 1.2K plays this week
                      </div>
                      <h3 className="text-3xl font-bold mb-4">F1 Race Predictor</h3>
                      <p className="text-lg opacity-90 max-w-md mb-6">
                        Test your F1 knowledge by predicting race outcomes. Earn XP and BSTR rewards for accurate predictions! Use real-time telemetry data to make informed decisions.
                      </p>
                      <div className="flex gap-3">
                        <Button className="bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2">
                          🎮 Play Now
                        </Button>
                        <div className="text-sm opacity-80 flex items-center gap-3">
                          <span>Created by DRVN Labs</span>
                          <span>•</span>
                          <span>Prediction</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Saved Games Section */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Saved Games Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Discover amazing games and bookmark your favorites to create your personal collection.
                    </p>
                    <Button
                      onClick={() => setArcadeTab('games')}
                      className="bg-[#00daa2] text-black hover:bg-[#00c49a]"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Browse All Games
                    </Button>
                  </div>
                </div>
              )}

              {arcadeTab === 'games' && (
                <div className="space-y-6">
                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search games..."
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00daa2] focus:outline-none"
                        />
                        <div className="absolute left-3 top-3.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        Show Bookmarked Only
                      </button>
                    </div>
                  </div>

                  {/* Game Categories */}
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Prediction', 'Skill', 'Strategy', 'Racing', 'Puzzle', 'Social'].map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          category === 'All'
                            ? 'border-[#00daa2] bg-[#00daa2] text-black'
                            : 'border-gray-700 text-gray-400 hover:text-white hover:border-[#00daa2]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Games Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                      { id: '1', title: 'F1 Race Predictor', icon: '🏁', category: 'Prediction', plays: '1.2K', description: 'Predict race winners and podium finishes' },
                      { id: '2', title: 'Reaction Challenge', icon: '⚡', category: 'Skill', plays: '850', description: 'Test your lightning-fast reflexes' },
                      { id: '3', title: 'Tuner Shop Tycoon', icon: '🔧', category: 'Strategy', plays: '2.1K', description: 'Build and manage your dream garage' },
                      { id: '4', title: 'Pit Stop Challenge', icon: '🏎️', category: 'Skill', plays: '645', description: 'Complete pit stops as fast as possible' },
                      { id: '5', title: 'Track Master', icon: '🏆', category: 'Puzzle', plays: '423', description: 'Learn famous racing circuits' },
                      { id: '6', title: 'Drift King', icon: '💨', category: 'Racing', plays: '891', description: 'Master the art of drifting' },
                      { id: '7', title: 'Engine Builder', icon: '🔩', category: 'Strategy', plays: '567', description: 'Assemble high-performance engines' },
                      { id: '8', title: 'Checkpoint Rush', icon: '🎯', category: 'Racing', plays: '734', description: 'Race against time through checkpoints' },
                    ].map((game) => (
                      <div key={game.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-[#00daa2] transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-3xl">{game.icon}</div>
                          <button className="text-gray-400 hover:text-[#00daa2] transition-colors">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                        <h3 className="text-white font-bold mb-2 group-hover:text-[#00daa2] transition-colors">{game.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded">{game.category}</span>
                          <span className="text-gray-400">{game.plays} plays</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {arcadeTab === 'stats' && (
                <div className="space-y-6">
                  {/* Stats Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: 'Total Games Played', value: '42', icon: '🎮', color: 'from-blue-500 to-blue-600' },
                      { title: 'XP Earned', value: '12,450', icon: '⭐', color: 'from-yellow-500 to-yellow-600' },
                      { title: 'Achievements', value: '8/15', icon: '🏆', color: 'from-green-500 to-green-600' },
                      { title: 'Rank', value: '#247', icon: '📊', color: 'from-purple-500 to-purple-600' },
                    ].map((stat, index) => (
                      <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-lg p-4 text-white`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-sm opacity-90">{stat.title}</p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Stats */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart className="w-8 h-8 text-[#00daa2]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Detailed Statistics</h3>
                    <p className="text-gray-400 mb-6">
                      Track your gaming performance, achievements, and progress across all arcade games.
                    </p>
                    <Button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.open('/arcade/stats', '_blank');
                        }
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white hover:border-[#00daa2]"
                    >
                      View Full Stats
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">
              Page Not Found
            </h1>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 grid-background overflow-x-hidden mobile-optimized">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div
          className={`relative bg-gray-950 border-r border-[#8351a1] transition-all duration-300 hidden md:block ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse Arrow */}
          <button
            onClick={toggleSidebar}
            className="sidebar-collapse-arrow"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft
              className={`transition-transform duration-300 ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Sidebar Content */}
          <TooltipProvider>
            <div className={`${sidebarCollapsed ? "p-2" : "p-6"}`}>
              {/* Logo Section */}
              <div
                className={`transition-all duration-300 ${
                  sidebarCollapsed ? "flex justify-center mt-20" : "mb-6"
                }`}
              >
                {sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Image
                          src="/Cars/DRVNWHITE.png"
                          alt="DRVN VHCLS"
                          width={120}
                          height={60}
                          className="transition-all duration-300 w-auto h-auto"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-black border-gray-700 text-[#00daa2] font-mono"
                    >
                      DRVN VHCLS
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Image
                    src="/Cars/DRVNWHITE.png"
                    alt="DRVN VHCLS"
                    width={120}
                    height={60}
                    className="transition-all duration-300 w-auto h-auto"
                  />
                )}
              </div>

              {/* Sign Up/Login Button or User Profile */}
              <div
                className={`mb-6 transition-all duration-300 ${
                  sidebarCollapsed ? "flex justify-center mt-6" : ""
                }`}
              >
                {address && isAuthenticated && currentUser ? (
                  // User Profile - Show when signed in and authenticated
                  sidebarCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#00daa2]">
                            <Image
                              src={
                                currentUser?.profileImage ||
                                "/Cars/UserImage.png"
                              }
                              alt="Profile"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-black border-gray-700 text-[#00daa2] font-mono"
                      >
                        @{currentUser?.username || "username"}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00daa2] flex-shrink-0">
                          <Image
                            src={
                              currentUser?.profileImage || "/Cars/UserImage.png"
                            }
                            alt="Profile"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-mono font-semibold text-sm truncate">
                            @{currentUser?.username || "username"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-[#00daa2] rounded-full"></div>
                            <span className="text-[#00daa2] text-xs font-mono">
                              Connected
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-700">
                        <ConnectButton />
                      </div>
                    </div>
                  )
                ) : // Sign Up/Login Button - Show when not signed in or not authenticated
                sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-[#00daa2] text-[#00daa2] hover:bg-[#00daa2] hover:text-black bg-transparent"
                        onClick={handleAuthClick}
                        title="Sign Up/Login"
                      >
                        <UserPlus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-black border-gray-700 text-[#00daa2] font-mono"
                    >
                      Sign Up/Login
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="outline"
                    className="border-[#00daa2] text-white hover:bg-[#00daa2] hover:text-black bg-transparent w-full font-mono font-semibold"
                    onClick={handleAuthClick}
                  >
                    SIGN UP/LOGIN
                  </Button>
                )}
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {/* Main Navigation Items (Green) */}
                {navigationItems
                  .filter((item) => {
                    // Always show navigation items, but handle access in click handlers
                    return item.isGreen;
                  })
                  .map((item) =>
                    sidebarCollapsed ? (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold justify-center ${
                              activePage === item.id
                                ? "text-[#00daa2] bg-gray-800"
                                : "text-[#00daa2] hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              // Use progressive disclosure for protected features
                              if (item.requiresAuth) {
                                let featureType:
                                  | "marketplace"
                                  | "garage"
                                  | "trading"
                                  | "social" = "garage";
                                if (item.id === "buster-club") {
                                  featureType = "trading";
                                } else if (
                                  item.id === "settings" ||
                                  item.id === "garage"
                                ) {
                                  featureType = "garage";
                                }

                                if (!canAccessProtectedFeature(featureType)) {
                                  // The ProgressiveActionButton will handle the prompt
                                  return;
                                }
                              }
                              setActivePage(item.id);
                            }}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-black border-gray-700 text-[#00daa2] font-mono"
                        >
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold w-full text-left justify-start ${
                          activePage === item.id
                            ? "text-[#00daa2] bg-gray-800"
                            : "text-[#00daa2] hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          // Use progressive disclosure for protected features
                          if (item.requiresAuth) {
                            let featureType:
                              | "marketplace"
                              | "garage"
                              | "trading"
                              | "social" = "garage";
                            if (item.id === "buster-club") {
                              featureType = "trading";
                            } else if (
                              item.id === "settings" ||
                              item.id === "garage"
                            ) {
                              featureType = "garage";
                            }

                            if (!canAccessProtectedFeature(featureType)) {
                              // The ProgressiveActionButton will handle the prompt
                              return;
                            }
                          }
                          setActivePage(item.id);
                        }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-0">{item.label}</span>
                      </Button>
                    ),
                  )}

                {/* Separator */}
                {!sidebarCollapsed && (
                  <div className="border-t border-gray-700 my-2"></div>
                )}

                {/* Social Navigation Items (White) */}
                {navigationItems
                  .filter((item) => !item.isGreen)
                  .map((item) =>
                    sidebarCollapsed ? (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold justify-center text-gray-300 hover:text-[#00daa2] hover:bg-gray-800"
                            onClick={() => setActivePage(item.id)}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-black border-gray-700 text-[#00daa2] font-mono"
                        >
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold w-full text-left justify-start text-gray-300 hover:text-[#00daa2] hover:bg-gray-800"
                        onClick={() => {
                          if (item.externalUrl) {
                            handleExternalLink(item.externalUrl);
                          } else {
                            setActivePage(item.id);
                          }
                        }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-0">{item.label}</span>
                      </Button>
                    ),
                  )}
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          data-mobile-sidebar
          className={`fixed inset-y-0 left-0 z-[50] w-64 bg-gray-950 border-r border-[#8351a1] transform transition-transform duration-300 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Sidebar Content */}
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 rounded-md border border-gray-700"
                onClick={toggleMobileMenu}
                title="Close Menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Logo Section */}
            <div className="mb-6">
              <Image
                src="/Cars/DRVNWHITE.png"
                alt="DRVN VHCLS"
                width={120}
                height={60}
                className="transition-all duration-300 w-auto h-auto"
              />
            </div>

            {/* Sign Up/Login Button or User Profile */}
            <div className="mb-6">
              {address && isAuthenticated && currentUser ? (
                // User Profile - Show when signed in and authenticated
                <div className="pt-3 border-t border-gray-700">
                  <ConnectButton />
                </div>
              ) : (
                // Sign Up/Login Button - Show when not signed in or not authenticated
                <Button
                  variant="outline"
                  className="border-[#00daa2] text-white hover:bg-[#00daa2] hover:text-black bg-transparent w-full font-mono font-semibold"
                  onClick={handleAuthClick}
                >
                  SIGN UP/LOGIN
                </Button>
              )}
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {/* Main Navigation Items (Green) */}
              {navigationItems
                .filter(
                  (item) => item.isGreen, // Always show, handle access in click
                )
                .map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold w-full text-left justify-start ${
                      activePage === item.id
                        ? "text-[#00daa2] bg-gray-800"
                        : "text-[#00daa2] hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (item.externalUrl) {
                        handleExternalLink(item.externalUrl);
                      } else {
                        // Use progressive disclosure for protected features
                        if (item.requiresAuth) {
                          let featureType:
                            | "marketplace"
                            | "garage"
                            | "trading"
                            | "social" = "garage";
                          if (item.id === "buster-club") {
                            featureType = "trading";
                          } else if (
                            item.id === "settings" ||
                            item.id === "garage"
                          ) {
                            featureType = "garage";
                          }

                          if (!canAccessProtectedFeature(featureType)) {
                            // The ProgressiveActionButton will handle the prompt
                            return;
                          }
                        }
                        setActivePage(item.id);
                      }
                      toggleMobileMenu();
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-0">{item.label}</span>
                  </Button>
                ))}

              {/* Separator */}
              <div className="border-t border-gray-700 my-2"></div>

              {/* Social Navigation Items (White) */}
              {navigationItems
                .filter((item) => !item.isGreen)
                .map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors font-mono font-semibold w-full text-left justify-start text-gray-300 hover:text-[#00daa2] hover:bg-gray-800"
                    onClick={() => {
                      if (item.externalUrl) {
                        handleExternalLink(item.externalUrl);
                      } else {
                        setActivePage(item.id);
                      }
                      toggleMobileMenu();
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-0">{item.label}</span>
                  </Button>
                ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-5 border-b border-[#8351a1] bg-gray-950">
            <div className="flex items-center gap-4">
              {/* Mobile Logo */}
              <div className="md:hidden">
                <Image
                  src="/Cars/DRVNWHITE.png"
                  alt="DRVN VHCLS"
                  width={60}
                  height={40}
                  className="transition-all duration-300 w-auto h-auto"
                />
              </div>
            </div>

            <div className="flex bg-none items-center gap-2 md:gap-4 px-2 py-1 rounded-md">
              <div className="hidden md:flex text-[#8351a1] text-xs md:text-sm font-mono">
                XP / coming soon
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white border border-[#8351a1] md:hidden"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-5 w-7" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6 space-y-6 md:space-y-8 flex-1 overflow-y-auto mobile-scroll">
            {renderPageContent()}
          </main>
        </div>
      </div>

      {/* Modals */}
      {/* Auto Signup Modal - Shows when wallet connects but user doesn't exist */}
      <AutoSignupModal
        isOpen={shouldShowSignup && showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleSignupSuccess}
      />

      {/* Manual Auth Choice Modal - Shows when user manually clicks auth */}
      <AuthChoiceModal
        isOpen={showAuthModal && !shouldShowSignup}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleSigninSuccess}
      />
    </div>
  );
}
