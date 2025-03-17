import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    // Get email from URL query params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, this would verify the code with your backend
      // For demo purposes, we'll accept any 6-digit code
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      if (email) {
        await verifyEmail(email);
      }

      setSuccess(true);

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, this would call your API to resend the code
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Reset timer
      setRemainingTime(300);
      setCanResend(false);

      // Show success message
      setError("A new verification code has been sent to your email.");
    } catch (err) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-indigo-100 p-3 rounded-full mb-4">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              {success ? (
                "Your email has been successfully verified!"
              ) : (
                <>
                  We've sent a verification code to{" "}
                  <span className="font-medium">{email}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto bg-green-100 p-3 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">
                  Verification Successful!
                </p>
                <p className="text-gray-500 mt-2">
                  Redirecting to login page...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Verification Code
                    </label>
                    <span className="text-sm text-gray-500">
                      {canResend
                        ? "Time expired"
                        : `Expires in ${formatTime(remainingTime)}`}
                    </span>
                  </div>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => {
                      // Only allow numbers and limit to 6 digits
                      const value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 6);
                      setVerificationCode(value);
                    }}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleVerify}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isSubmitting || verificationCode.length !== 6}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="link"
                    onClick={handleResendCode}
                    disabled={isSubmitting || !canResend}
                    className={canResend ? "text-indigo-600" : "text-gray-400"}
                  >
                    Resend Code
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="link" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
