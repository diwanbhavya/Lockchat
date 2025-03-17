import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthIndicator({
  password = "",
  className,
}: PasswordStrengthIndicatorProps) {
  // Calculate password strength
  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 20; // Has uppercase
    if (/[a-z]/.test(password)) strength += 15; // Has lowercase
    if (/[0-9]/.test(password)) strength += 15; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Has special char

    return Math.min(strength, 100);
  };

  const strength = getPasswordStrength(password);

  // Determine strength category and color
  const getStrengthCategory = (
    strength: number,
  ): { label: string; color: string } => {
    if (strength < 40) return { label: "Weak", color: "bg-red-500" };
    if (strength < 70) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const { label, color } = getStrengthCategory(strength);

  // Generate suggestions based on current password
  const getSuggestions = (password: string): string[] => {
    const suggestions: string[] = [];

    if (password.length < 8) {
      suggestions.push("Use at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      suggestions.push("Add uppercase letters");
    }

    if (!/[a-z]/.test(password)) {
      suggestions.push("Add lowercase letters");
    }

    if (!/[0-9]/.test(password)) {
      suggestions.push("Add numbers");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      suggestions.push("Add special characters (e.g., !@#$%)");
    }

    return suggestions;
  };

  const suggestions = getSuggestions(password);

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <span
          className={cn(
            "text-sm font-medium",
            label === "Weak" && "text-red-500",
            label === "Medium" && "text-yellow-500",
            label === "Strong" && "text-green-500",
          )}
        >
          {label}
        </span>
      </div>

      <Progress
        value={strength}
        className="h-2 w-full bg-gray-200"
        indicatorClassName={cn(color, "transition-all duration-300")}
      />

      {suggestions.length > 0 && strength < 70 && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">Suggestions to improve:</p>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
