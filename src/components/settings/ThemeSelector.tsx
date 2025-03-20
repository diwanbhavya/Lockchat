import React, { useState, useEffect } from "react";
import { Check, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
}

const themes = [
  {
    id: "default",
    name: "Default",
    colors: ["bg-indigo-600", "bg-purple-600"],
  },
  {
    id: "blue",
    name: "Ocean Blue",
    colors: ["bg-blue-600", "bg-cyan-500"],
  },
  {
    id: "green",
    name: "Forest Green",
    colors: ["bg-green-600", "bg-emerald-500"],
  },
  {
    id: "red",
    name: "Ruby Red",
    colors: ["bg-red-600", "bg-rose-500"],
  },
  {
    id: "orange",
    name: "Sunset Orange",
    colors: ["bg-orange-500", "bg-amber-400"],
  },
];

const ThemeSelector = ({
  value: propValue,
  onChange: propOnChange,
  onSave,
}: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();

  // Use props if provided, otherwise use context
  const value = propValue || theme;
  const [selectedTheme, setSelectedTheme] = useState(value);
  const [savedTheme, setSavedTheme] = useState(value);

  useEffect(() => {
    // Load theme from localStorage if available
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      setSavedTheme(storedTheme);
      applyTheme(storedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    if (propOnChange) {
      propOnChange(newTheme);
    }
  };

  const applyTheme = (theme: string) => {
    document.body.classList.remove(
      "theme-default",
      "theme-blue",
      "theme-green",
      "theme-red",
      "theme-orange",
    );
    document.body.classList.add(`theme-${theme}`);
  };

  const saveTheme = () => {
    localStorage.setItem("theme", selectedTheme);
    setSavedTheme(selectedTheme);
    setTheme(selectedTheme as any);
    applyTheme(selectedTheme);

    if (onSave) {
      onSave();
    }
  };

  const hasChanges = selectedTheme !== savedTheme;

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <Palette className="h-4 w-4 text-purple-600 mr-2" />
        <h4 className="font-medium text-gray-900">Color Theme</h4>
      </div>
      <p className="text-sm text-gray-500">
        Choose your preferred color theme for the application
      </p>

      <RadioGroup
        value={selectedTheme}
        onValueChange={handleThemeChange}
        className="grid grid-cols-2 gap-4 pt-2"
      >
        {themes.map((theme) => (
          <div key={theme.id} className="relative">
            <RadioGroupItem
              value={theme.id}
              id={`theme-${theme.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`theme-${theme.id}`}
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${selectedTheme === theme.id ? "border-indigo-500" : ""}`}
            >
              <div className="w-full h-12 rounded-md overflow-hidden mb-2 relative">
                <div
                  className={`absolute inset-0 w-1/2 ${theme.colors[0]}`}
                ></div>
                <div
                  className={`absolute inset-0 w-1/2 left-1/2 ${theme.colors[1]}`}
                ></div>
                {selectedTheme === theme.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <span className="block w-full text-center font-medium">
                {theme.name}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        className="w-full mt-4"
        onClick={saveTheme}
        disabled={!hasChanges}
      >
        {hasChanges ? "Save Theme" : "Theme Saved"}
      </Button>
    </div>
  );
};

export default ThemeSelector;
