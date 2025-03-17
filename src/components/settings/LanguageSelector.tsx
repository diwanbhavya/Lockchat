import React from "react";
import { Check, Globe } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
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
];

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <Globe className="h-4 w-4 text-purple-600 mr-2" />
        <h4 className="font-medium text-gray-900">Language</h4>
      </div>
      <p className="text-sm text-gray-500">
        Select your preferred language for the application
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
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
              className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${value === language.id ? "border-indigo-500" : ""}`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-2">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              {value === language.id && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default LanguageSelector;
