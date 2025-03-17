import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Shield } from "lucide-react";
import { Button } from "../ui/button";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1.5,
          }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-r from-pink-500 to-indigo-500 p-6 rounded-full shadow-2xl">
            <Lock size={80} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 tracking-tighter"
        >
          LOCKCHAT
        </motion.h1>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-10 py-7 text-2xl rounded-full shadow-2xl transition-all duration-300 hover:shadow-pink-500/30 font-bold tracking-wide"
            >
              GET STARTED
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8"
      >
        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <Shield size={20} className="text-pink-400 mr-2" />
          <Lock size={20} className="text-indigo-400 mr-2" />
          <span className="text-white font-medium">LOCKCHAT</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
