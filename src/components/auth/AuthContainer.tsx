import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Shield } from "lucide-react";

interface AuthContainerProps {
  defaultTab?: "login" | "signup";
  onLoginSubmit?: (values: any) => void;
  onSignupSubmit?: (values: any) => void;
  isLoading?: boolean;
}

const AuthContainer = ({
  defaultTab = "login",
  onLoginSubmit = () => {},
  onSignupSubmit = () => {},
  isLoading = false,
}: AuthContainerProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [password, setPassword] = useState("");

  // Animation variants for tab transitions
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const handleLoginSubmit = (values: any) => {
    onLoginSubmit(values);
    // For demo purposes, add direct navigation
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const navigate = useNavigate();

  const handleSignupSubmit = (values: any) => {
    // Update password for strength indicator
    setPassword(values.password);
    onSignupSubmit(values);

    // Redirect to login page after successful signup
    setTimeout(() => {
      setActiveTab("login");
    }, 1500);
  };

  const switchToLogin = () => setActiveTab("login");
  const switchToSignup = () => setActiveTab("signup");

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-purple-100">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">LOCKCHAT</h1>
        <p className="text-sm opacity-90 mt-2 font-medium">
          Secure Authentication & Password Analysis
        </p>
      </div>

      <Card className="border-0 shadow-none">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-purple-50">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md py-2"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md py-2"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <CardContent className="px-4 py-2">
            <TabsContent value="login">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
              >
                <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
              </motion.div>
            </TabsContent>

            <TabsContent value="signup">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <SignupForm
                  onSubmit={handleSignupSubmit}
                  onLoginClick={switchToLogin}
                />

                {/* Additional password strength indicator section */}
                {activeTab === "signup" && password && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 text-indigo-600 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700">
                        Password Analysis
                      </h3>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 text-center text-xs text-gray-600 border-t border-purple-100">
        <p className="flex items-center justify-center">
          <Shield className="h-3 w-3 text-indigo-500 mr-1" />
          Protected with advanced encryption and security analysis
        </p>
      </div>
    </div>
  );
};

export default AuthContainer;
