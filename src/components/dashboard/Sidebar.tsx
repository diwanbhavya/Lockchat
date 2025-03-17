import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Home,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Shield,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import AppLogo from "../common/AppLogo";

interface SidebarProps {
  username?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  onNavigate?: (section: string) => void;
}

const Sidebar = ({
  username = "User",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  onLogout = () => console.log("Logout clicked"),
  onNavigate,
}: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      id: "overview",
      path: "/dashboard",
      icon: <Home size={20} />,
      label: "Dashboard",
    },
    {
      id: "chat",
      path: "/chat",
      icon: <MessageSquare size={20} />,
      label: "Secure Chat",
    },
    {
      id: "profile",
      path: "/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      id: "security",
      path: "/security",
      icon: <Shield size={20} />,
      label: "Security",
    },
    {
      id: "settings",
      path: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  const handleNavigation = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full w-[250px] bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4 shadow-lg"
    >
      {/* Logo section */}
      <div className="flex justify-center mb-8 p-2">
        <AppLogo size="lg" />
      </div>

      {/* User profile section */}
      <div className="flex items-center space-x-3 mb-8 p-2 bg-indigo-800/50 rounded-lg">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400">
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 truncate">
          <p className="font-medium truncate">{username}</p>
          <p className="text-xs text-indigo-300 truncate">Secure Account</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? "bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600" : "hover:bg-indigo-800/50"}`}
                  onClick={() => handleNavigation(item.id)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto pt-4 border-t border-indigo-700">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-indigo-800/50"
                onClick={onLogout}
              >
                <span className="mr-2">
                  <LogOut size={20} />
                </span>
                Logout
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* App logo at bottom */}
      <div className="flex justify-center mt-4 pt-4 opacity-70">
        <div className="flex items-center">
          <Lock size={14} className="mr-1" />
          <span className="text-xs">LockChat</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
