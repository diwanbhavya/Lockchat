import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeType = "default" | "blue" | "green" | "red" | "orange";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Try to get the theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as ThemeType) || "default";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);

    // Apply theme classes to the document body
    document.body.classList.remove(
      "theme-default",
      "theme-blue",
      "theme-green",
      "theme-red",
      "theme-orange",
    );
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
