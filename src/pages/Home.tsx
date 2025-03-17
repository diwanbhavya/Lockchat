import React from "react";
import { Navigate } from "react-router-dom";
import IntroScreen from "@/components/common/IntroScreen";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <IntroScreen />;
};

export default Home;
