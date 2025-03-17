import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: "default" | "outline" | "ghost";
}

const BackButton = ({
  onClick,
  label = "Back to Dashboard",
  variant = "outline",
}: BackButtonProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      className="mb-4 flex items-center gap-1 hover:gap-2 transition-all duration-200"
      onClick={onClick}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;
