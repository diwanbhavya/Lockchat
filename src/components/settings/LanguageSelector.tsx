import React, { useState, useEffect } from "react";
import { Check, Globe } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: string;
  onSave?: () => void;
}

const languages = [
  {
    id: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    id: "fr",
    name: "Français",
    flag: "🇫🇷",
  },
  {
    id: "es",
    name: "Español",
    flag: "🇪🇸",
  },
  {
    id: "de",
    name: "Deutsch",
    flag: "🇩🇪",
  },
];

const LanguageSelector = ({
  value: initialValue = "en",
  onChange: propOnChange,
  width = "auto",
  onSave,
}: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialValue);
  const [savedLanguage, setSavedLanguage] = useState(initialValue);

  useEffect(() => {
    // Load language from localStorage if available
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      setSavedLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    if (propOnChange) {
      propOnChange(value);
    }
  };

  const saveLanguage = () => {
    localStorage.setItem("language", selectedLanguage);
    setSavedLanguage(selectedLanguage);

    // In a real app, this would update the language in the entire application
    document.documentElement.lang = selectedLanguage;

    if (onSave) {
      onSave();
    }
  };

  const hasChanges = selectedLanguage !== savedLanguage;

  return (
    <div className="space-y-3" style={{ width }}>
      <div className="flex items-center">
        <Globe className="h-4 w-4 text-purple-600 mr-2" />
        <h4 className="font-medium text-gray-900">Language</h4>
      </div>
      <p className="text-sm text-gray-500">
        Select your preferred language for the application
      </p>

      <RadioGroup
        value={selectedLanguage}
        onValueChange={handleLanguageChange}
        className="grid grid-cols-2 gap-4 pt-2"
      >
        {languages.map((language) => (
          <div key={language.id} className="relative">
            <RadioGroupItem
              value={language.id}
              id={`language-${language.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`language-${language.id}`}
              className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${selectedLanguage === language.id ? "border-indigo-500" : ""}`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-2">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              {selectedLanguage === language.id && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        className="w-full mt-4"
        onClick={saveLanguage}
        disabled={!hasChanges}
      >
        {hasChanges ? "Save Language" : "Language Saved"}
      </Button>
    </div>
  );
};

export default LanguageSelector;
