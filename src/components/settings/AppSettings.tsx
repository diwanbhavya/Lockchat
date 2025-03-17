import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AppLogo from "../common/AppLogo";
import PasswordChange from "./PasswordChange";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/context/ThemeContext";

const AppSettings = () => {
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    // Handle save functionality
    console.log("Settings saved");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto py-8"
    >
      <Card className="w-full shadow-lg border-0">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="password">Password Settings</TabsTrigger>
          </TabsList>

          <CardContent className="pt-6">
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="grid gap-4">
                  <ThemeSelector />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>
                <div className="grid gap-4">
                  <LanguageSelector defaultValue="en-US" width="600" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <PasswordChange />
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">Reset to Defaults</Button>
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
