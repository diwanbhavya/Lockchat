import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AppLogo from "../common/AppLogo";
import PasswordChange from "./PasswordChange";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/context/ThemeContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface AppSettingsProps {
  onBack?: () => void;
}

const AppSettings = ({ onBack }: AppSettingsProps) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "en",
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value as any);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleSave = () => {
    // Apply theme change
    setTheme(selectedTheme as any);

    // Apply language change
    localStorage.setItem("language", selectedLanguage);

    // Show success message
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    setSelectedTheme("default");
    setSelectedLanguage("en");
  };

  const handleSettingsSaved = (section: string) => {
    toast({
      title: "Settings updated",
      description: `Your ${section} settings have been saved successfully.`,
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto py-8"
    >
      {saveSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <Card className="w-full shadow-lg border-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="password">Password Settings</TabsTrigger>
          </TabsList>

          <CardContent className="pt-6">
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="grid gap-4">
                  <ThemeSelector
                    value={selectedTheme}
                    onChange={handleThemeChange}
                    onSave={() => handleSettingsSaved("appearance")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>
                <div className="grid gap-4">
                  <LanguageSelector
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    onSave={() => handleSettingsSaved("language")}
                    width="100%"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <PasswordChange onSave={() => handleSettingsSaved("password")} />
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </CardFooter>
        </Tabs>
      </Card>

      <div className="flex justify-center mt-6">
        <AppLogo variant="dark" size="sm" />
      </div>
    </motion.div>
  );
};

export default AppSettings;
