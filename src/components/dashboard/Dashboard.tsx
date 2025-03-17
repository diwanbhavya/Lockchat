import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Shield, User, Settings, Lock } from "lucide-react";

import Sidebar from "./Sidebar";
import ProfileManagement from "../profile/ProfileManagement";
import SecureChat from "../chat/SecureChat";
import PasswordCracker from "../security/PasswordCracker";
import AppSettings from "../settings/AppSettings";
import AppLogo from "../common/AppLogo";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "@/context/AuthContext";

interface DashboardProps {
  user?: {
    username: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    lastLogin?: Date;
    passwordStrength?: "weak" | "medium" | "strong";
  };
  onLogout?: () => void;
}

const Dashboard = ({
  user = {
    username: "johndoe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    passwordStrength: "strong",
  },
  onLogout = () => console.log("Logout clicked"),
}: DashboardProps) => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState<
    "overview" | "profile" | "chat" | "security" | "settings"
  >("overview");
  // Load user data from localStorage if available
  const savedAvatar = localStorage.getItem("userAvatar");
  const savedFullName = localStorage.getItem("userFullName");
  const savedBio = localStorage.getItem("userBio");
  const savedUsername = localStorage.getItem("userUsername");

  const [updatedUser, setUpdatedUser] = useState({
    ...user,
    avatarUrl: savedAvatar || user.avatarUrl,
    fullName: savedFullName || user.fullName,
    bio: savedBio || user.bio,
    username: savedUsername || user.username,
  });

  const handleNavigation = (
    section: "overview" | "profile" | "chat" | "security" | "settings",
  ) => {
    setActiveSection(section);
  };

  const handleProfileUpdate = async (profileData: any) => {
    try {
      await updateProfile(profileData);
      // Update the local user state with the new profile data
      setUpdatedUser({
        ...updatedUser,
        ...profileData,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const getPasswordStrengthColor = (
    strength?: "weak" | "medium" | "strong",
  ) => {
    switch (strength) {
      case "weak":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "strong":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Sidebar
        username={updatedUser.username}
        avatarUrl={updatedUser.avatarUrl}
        onLogout={onLogout}
        onNavigate={handleNavigation}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {activeSection === "overview" && "Dashboard"}
            {activeSection === "profile" && "Profile Management"}
            {activeSection === "chat" && "Secure Chat"}
            {activeSection === "security" && "Password Security"}
            {activeSection === "settings" && "App Settings"}
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 ring-2 ring-purple-200">
                <AvatarImage
                  src={updatedUser.avatarUrl}
                  alt={updatedUser.username}
                />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {updatedUser.fullName}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className="border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Account Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-green-400 to-green-500">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">Active</div>
                            <div className="text-xs text-gray-500">
                              Last login:{" "}
                              {updatedUser.lastLogin instanceof Date
                                ? updatedUser.lastLogin.toLocaleDateString()
                                : new Date(
                                    updatedUser.lastLogin
                                      ? new Date(
                                          updatedUser.lastLogin,
                                        ).getTime()
                                      : Date.now(),
                                  ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card className="border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Password Strength
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-blue-400 to-indigo-500">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold capitalize">
                              {updatedUser.passwordStrength || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {updatedUser.passwordStrength === "weak" &&
                                "Consider updating your password"}
                              {updatedUser.passwordStrength === "medium" &&
                                "Your password is reasonably secure"}
                              {updatedUser.passwordStrength === "strong" &&
                                "Your password is very secure"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Card className="border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Security Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-purple-400 to-pink-500">
                            <Settings className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">Protected</div>
                            <div className="text-xs text-gray-500">
                              All security features are enabled
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-600 data-[state=active]:text-white"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-600 data-[state=active]:text-white"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-600 data-[state=active]:text-white"
                    >
                      Activity
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <Card className="border-indigo-100 shadow-md">
                      <CardHeader>
                        <CardTitle>Welcome, {updatedUser.fullName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500">
                          Your account is fully set up and ready to use. You can
                          check your password security, manage your profile, or
                          start a secure chat from the sidebar.
                        </p>
                        <div className="mt-4 flex space-x-4">
                          <Button
                            onClick={() => handleNavigation("security")}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            Check Password Security
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleNavigation("profile")}
                            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                          >
                            Manage Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="security" className="space-y-4">
                    <Card className="border-indigo-100 shadow-md">
                      <CardHeader>
                        <CardTitle>Security Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Badge
                                className={getPasswordStrengthColor(
                                  updatedUser.passwordStrength,
                                )}
                              >
                                {updatedUser.passwordStrength || "Unknown"}
                              </Badge>
                              <span className="ml-2">Password Strength</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNavigation("security")}
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                            >
                              Test Password
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Enabled
                              </Badge>
                              <span className="ml-2">
                                Two-Factor Authentication
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                            >
                              Configure
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Enabled
                              </Badge>
                              <span className="ml-2">Login Notifications</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                            >
                              Configure
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="activity" className="space-y-4">
                    <Card className="border-indigo-100 shadow-md">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-blue-400 to-indigo-500">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Login</div>
                              <div className="text-sm text-gray-500">
                                {updatedUser.lastLogin instanceof Date
                                  ? updatedUser.lastLogin.toLocaleString()
                                  : new Date(
                                      updatedUser.lastLogin
                                        ? new Date(
                                            updatedUser.lastLogin,
                                          ).getTime()
                                        : Date.now(),
                                    ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-purple-400 to-pink-500">
                              <Settings className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Profile Updated</div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  Date.now() - 172800000,
                                ).toLocaleString()}{" "}
                                {/* 2 days ago */}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mr-4 rounded-full p-2 bg-gradient-to-br from-green-400 to-teal-500">
                              <Shield className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Security Check</div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  Date.now() - 259200000,
                                ).toLocaleString()}{" "}
                                {/* 3 days ago */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileManagement user={updatedUser} />
              </motion.div>
            )}

            {activeSection === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SecureChat
                  isAuthenticated={true}
                  username={updatedUser.username}
                />
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PasswordCracker
                  userPassword="password123"
                  username={updatedUser.username}
                />
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AppSettings onBack={() => setActiveSection("overview")} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
