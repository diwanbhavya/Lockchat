import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContainer from "./auth/AuthContainer";
import Dashboard from "./dashboard/Dashboard";
import EmailVerification from "./common/EmailVerification";
import { useAuth } from "../context/AuthContext";

interface HomeProps {
  isAuthenticated?: boolean;
  isVerifying?: boolean;
}

const Home = ({ isAuthenticated = false, isVerifying = false }: HomeProps) => {
  const {
    user,
    login,
    signup,
    logout,
    verifyEmail,
    isAuthenticated: isUserAuthenticated,
    error,
  } = useAuth();
  const navigate = useNavigate();

  const [authState, setAuthState] = useState<
    "unauthenticated" | "verifying" | "authenticated"
  >("unauthenticated");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Update auth state based on authentication context
  useEffect(() => {
    if (isUserAuthenticated) {
      setAuthState("authenticated");
    }
  }, [isUserAuthenticated]);

  const handleLoginSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      setAuthState("authenticated");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(
        "Login failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      await signup(values.name, values.email, values.password);
      setUserEmail(values.email);
      setAuthState("verifying");
    } catch (err) {
      console.error("Signup error:", err);
      alert(
        "Signup failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    try {
      setIsLoading(true);
      await verifyEmail(userEmail);
      // After verification, redirect to login
      setAuthState("unauthenticated");
      alert("Email verified successfully! You can now log in.");
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthState("unauthenticated");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {authState === "unauthenticated" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Password Strength Analyzer
              </h1>
              <p className="text-lg text-indigo-700 mb-6">
                Secure your online presence with our advanced password analysis
                and secure chat platform.
              </p>
              <div className="hidden md:block space-y-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Real-time password strength analysis
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Secure end-to-end encrypted chat
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Advanced security recommendations
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <AuthContainer
                onLoginSubmit={handleLoginSubmit}
                onSignupSubmit={handleSignupSubmit}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}

        {authState === "verifying" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EmailVerification
              email={userEmail}
              onVerificationComplete={handleVerificationComplete}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {authState === "authenticated" && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[calc(100vh-2rem)] overflow-hidden rounded-xl shadow-2xl bg-white"
          >
            <Dashboard
              user={{
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                lastLogin: user.lastLogin,
                passwordStrength: user.passwordStrength,
              }}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
