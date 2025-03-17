import React from "react";
import { Lock } from "lucide-react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
}

const AppLogo = ({
  size = "md",
  variant = "light",
  showText = true,
}: AppLogoProps) => {
  const sizeMap = {
    sm: {
      container: "h-6 w-6",
      icon: 14,
      text: "text-xs",
    },
    md: {
      container: "h-8 w-8",
      icon: 18,
      text: "text-sm",
    },
    lg: {
      container: "h-10 w-10",
      icon: 24,
      text: "text-base",
    },
  };

  const variantMap = {
    light: {
      bg: "bg-white",
      iconColor: "text-indigo-600",
      textColor: "text-white",
    },
    dark: {
      bg: "bg-indigo-600",
      iconColor: "text-white",
      textColor: "text-gray-800",
    },
  };

  return (
    <div className="flex items-center">
      <div
        className={`${sizeMap[size].container} ${variantMap[variant].bg} rounded-full flex items-center justify-center mr-2`}
      >
        <Lock
          size={sizeMap[size].icon}
          className={variantMap[variant].iconColor}
        />
      </div>
      {showText && (
        <span
          className={`font-bold ${sizeMap[size].text} ${variantMap[variant].textColor}`}
        >
          LockChat
        </span>
      )}
    </div>
  );
};

export default AppLogo;
