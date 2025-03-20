import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  lastLogin?: Date;
  passwordStrength?: "weak" | "medium" | "strong";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  verifyEmail: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using named function declaration for consistent component exports
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signup({ name, email, password });
      // Don't automatically log in after signup - require email verification
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during logout",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setIsLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(user.id, profileData);
      setUser(updatedUser);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating profile",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.verifyEmail(email);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during email verification",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        verifyEmail,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Using named function declaration for hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
