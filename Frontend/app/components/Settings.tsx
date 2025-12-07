/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Edit, Save, X, User, FileText, Shield, HelpCircle, Upload } from "lucide-react";
import Image from "next/image";

/**
 * User interface representing the structure of user data
 * This matches the MongoDB schema and API responses
 */
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

/**
 * Props interface for the Settings component
 * @param currentUser - The currently authenticated user's data
 * @param isAuthenticated - Boolean indicating if user is authenticated
 * @param refreshUserData - Optional callback to refresh user data in parent component
 */
interface SettingsProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  refreshUserData?: () => void; // Refresh callback
}

/**
 * Settings Component
 *
 * This component provides a comprehensive user profile management interface
 * where users can view and edit their profile information including:
 * - Profile image upload
 * - Username, first name, last name
 * - Bio/description
 * - Real-time username validation
 *
 * The component includes:
 * - Edit mode toggle for profile fields
 * - Image upload functionality
 * - Username availability checking
 * - Form validation and error handling
 * - Success/error message display
 * - Additional settings sections (Accounts, Newsletter, About)
 */
export function Settings({ currentUser, isAuthenticated, refreshUserData }: SettingsProps) {
  // Wagmi hook to get connected wallet information
  const { address, isConnected } = useAccount();

  // State management for component functionality
  const [activeTab, setActiveTab] = useState("Account"); // Active settings tab
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode
  const [isLoading, setIsLoading] = useState(false); // Loading state for save operations
  const [isUploading, setIsUploading] = useState(false); // Loading state for image uploads

  // Form data state - holds current values being edited
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
    profileImage: "",
  });

  // UI state for user feedback
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [usernameError, setUsernameError] = useState(""); // Username validation error

  /**
   * Fetch editable user data (decrypted) for form editing
   */
  const fetchEditableUserData = useCallback(async () => {
    if (!currentUser?.walletAddress) return;

    try {
      const response = await fetch("/api/auth/user/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: currentUser.walletAddress }),
      });

      if (response.ok) {
        const userData = await response.json();
        const editableUser = userData.user;

        // Set form data with decrypted values
        setFormData({
          username: editableUser.username || "",
          firstName: editableUser.firstName || "",
          lastName: editableUser.lastName || "",
          bio: editableUser.bio || "",
          profileImage: editableUser.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching editable user data:", error);
      // Fallback to current user data if edit endpoint fails
      setFormData({
        username: currentUser.username || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        profileImage: currentUser.profileImage || "",
      });
    }
  }, [currentUser]);

  /**
   * Initialize form data when user data changes
   * This ensures the form always reflects the current user's data
   */
  useEffect(() => {
    if (currentUser) {
      fetchEditableUserData();
    }
  }, [currentUser, fetchEditableUserData]);

  // Early return if wallet not connected or user not authenticated
  // This prevents the component from rendering without proper authentication
  if (!isConnected || !isAuthenticated || !currentUser) {
    return null;
  }

  /**
   * Handles input changes for form fields
   * Updates the form state and clears username errors when typing
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear username error when user types to provide immediate feedback
    if (field === "username") {
      setUsernameError("");
    }
  };

  /**
   * Handles profile image upload
   * Sends file to upload API and updates form state with returned URL
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          profileImage: data.url,
        }));
        setMessage({
          type: "success",
          text: "Profile image uploaded successfully!",
        });
      } else {
        setMessage({ type: "error", text: "Failed to upload image" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error uploading image" });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Validates username availability
   * Checks if username is available (not taken by another user)
   * Skips validation if username hasn't changed
   */
  const validateUsername = async (username: string) => {
    if (username === currentUser.username) return true;

    try {
      const response = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, walletAddress: address }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.available) {
          setUsernameError("");
          return true;
        } else {
          setUsernameError("Username already taken");
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }

    return false;
  };

  /**
   * Handles saving profile changes
   * Validates username, sends update request, and refreshes parent data
   */
  const handleSave = async () => {
    if (!address) return;

    // Only save if we're actually in edit mode
    if (!isEditing) return;

    // Validate username before saving to prevent conflicts
    const isUsernameValid = await validateUsername(formData.username);
    if (!isUsernameValid) return;

    // Saving user data...

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          profileImage: formData.profileImage,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        // Refresh user data in parent component to sync changes
        if (refreshUserData) {
          refreshUserData();
        }
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles canceling edit mode
   * Resets form data to original values and clears any errors
   */
  const handleCancel = () => {
    // Reset form data to original values from currentUser
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        profileImage: currentUser.profileImage || "",
      });
    }
    setIsEditing(false);
    setMessage(null);
    setUsernameError("");
  };

  // Secondary navigation tabs
  const secondaryNavigation = [
    { name: "Account", current: activeTab === "Account" },
    { name: "Accounts", current: activeTab === "Accounts" },
    { name: "Newsletter", current: activeTab === "Newsletter" },
    { name: "About", current: activeTab === "About" },
  ];

  return (
    <div className="min-h-screen bg-none">
      {/* Secondary navigation header */}
      <header className="border-b border-gray-200 dark:border-white/5">
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={item.current ? "text-[#00daa2] dark:text-[#00daa2]" : ""}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <h1 className="sr-only">Account Settings</h1>

        {/* Settings forms */}
        <div className="divide-y divide-gray-200 dark:divide-white/10">
          {/* Account Tab - Personal Information */}
          {activeTab === "Account" && (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                  Update your profile information and preferences.
                </p>
              </div>

              <form
                className="md:col-span-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Only submit if we're in edit mode
                  if (isEditing) {
                    handleSave();
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  {/* Profile Image */}
                  <div className="col-span-full flex items-center gap-x-8">
                    <div className="relative">
                      {formData.profileImage ? (
                        <Image
                          src={formData.profileImage}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="size-24 flex-none rounded-lg bg-gray-100 object-cover outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10"
                        />
                      ) : (
                        <div className="size-24 flex-none rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center outline -outline-offset-1 outline-black/5 dark:outline-white/10">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      {isEditing ? (
                        <>
                          <label
                            htmlFor="profile-image-upload"
                            className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20"
                          >
                            Change avatar
                          </label>
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <p className="mt-2 text-xs/5 text-gray-500 dark:text-gray-400">
                            JPG, GIF or PNG. 1MB max.
                          </p>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20"
                        >
                          Change avatar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                    >
                      First name
                    </label>
                    <div className="mt-2">
                      {isEditing ? (
                        <input
                          id="first-name"
                          name="first-name"
                          type="text"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-[#00daa2] sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-[#00daa2]"
                          placeholder="First Name"
                        />
                      ) : (
                        <div className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10">
                          {currentUser.firstName || "No first name set"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                    >
                      Last name
                    </label>
                    <div className="mt-2">
                      {isEditing ? (
                        <input
                          id="last-name"
                          name="last-name"
                          type="text"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-[#00daa2] sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-[#00daa2]"
                          placeholder="Last Name"
                        />
                      ) : (
                        <div className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10">
                          {currentUser.lastName || "No last name set"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="col-span-full">
                    <label
                      htmlFor="username"
                      className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      {isEditing ? (
                        <div>
                          <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 ${
                              usernameError
                                ? "outline-red-500"
                                : "outline-gray-300 focus:outline focus:-outline-offset-2 focus:outline-[#00daa2]"
                            } placeholder:text-gray-400 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 ${
                              !usernameError && "dark:focus:outline-[#00daa2]"
                            }`}
                            placeholder="Username"
                          />
                          {usernameError && (
                            <p className="mt-1 text-xs/5 text-red-400">{usernameError}</p>
                          )}
                        </div>
                      ) : (
                        <div className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10">
                          {currentUser.username || "No username set"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="col-span-full">
                    <label
                      htmlFor="bio"
                      className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                    >
                      Bio
                    </label>
                    <div className="mt-2">
                      {isEditing ? (
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#00daa2] sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-[#00daa2]"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 min-h-[100px] sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10">
                          {currentUser.bio || "No bio set"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing ? (
                  <div className="mt-8 flex gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading || isUploading}
                      className="rounded-md bg-[#00daa2] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#00cc6a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00daa2] dark:shadow-none dark:hover:bg-[#00b894]"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="mt-8 flex">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      className="rounded-md bg-[#00daa2] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#00cc6a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00daa2] dark:shadow-none dark:hover:bg-[#00b894]"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}

                {/* Success/Error Message */}
                {message && (
                  <div
                    className={`mt-4 p-3 rounded-md border ${
                      message.type === "success"
                        ? "bg-green-900/20 border-green-500 text-green-400"
                        : "bg-red-900/20 border-red-500 text-red-400"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Accounts Tab - Wallet Management */}
          {activeTab === "Accounts" && (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  Manage Wallets
                </h2>
                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                  Connect and manage your wallet addresses.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center dark:bg-white/10">
                        <User className="w-4 h-4 text-gray-600 dark:text-white" />
                      </div>
                      <span className="text-gray-900 font-semibold dark:text-white">
                        Manage Wallets
                      </span>
                    </div>
                    <div className="text-[#00daa2]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === "Newsletter" && (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  Newsletter
                </h2>
                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                  Sign up for our newsletter to stay updated.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center dark:bg-white/10">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-white" />
                      </div>
                      <span className="text-gray-900 font-semibold dark:text-white">
                        Sign Up For Our Newsletter
                      </span>
                    </div>
                    <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Tab - Legal and Contact */}
          {activeTab === "About" && (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">About</h2>
                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                  Legal information and support resources.
                </p>
              </div>

              <div className="md:col-span-2 space-y-3">
                {/* Legal and Policies */}
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center dark:bg-white/10">
                        <Shield className="w-4 h-4 text-gray-600 dark:text-white" />
                      </div>
                      <span className="text-gray-900 font-semibold dark:text-white">
                        Legal And Policies
                      </span>
                    </div>
                    <div className="text-[#00daa2]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Contact and Links */}
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center dark:bg-white/10">
                        <HelpCircle className="w-4 h-4 text-gray-600 dark:text-white" />
                      </div>
                      <span className="text-gray-900 font-semibold dark:text-white">
                        Contact & Links
                      </span>
                    </div>
                    <div className="text-[#00daa2]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
