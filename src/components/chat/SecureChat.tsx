import React, { useState, useEffect } from "react";
import { Shield, Lock, AlertTriangle, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "@/context/AuthContext";

interface SecureChatProps {
  isAuthenticated?: boolean;
  username?: string;
  onLogout?: () => void;
}

// Simple AI responses based on user input
const generateAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("password") && lowerMessage.includes("strong")) {
    return "A strong password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters. Avoid using personal information or common words.";
  }

  if (lowerMessage.includes("password") && lowerMessage.includes("change")) {
    return "You can change your password in the Settings section. Make sure to choose a strong password that you haven't used before.";
  }

  if (lowerMessage.includes("security") || lowerMessage.includes("secure")) {
    return "Security is our top priority. We use end-to-end encryption for all messages and advanced password hashing techniques to protect your account.";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return `Hello! I'm your AI security assistant. How can I help you today with password security or account protection?`;
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
    return "I can help you with password security, account protection tips, or answer questions about our security features. What would you like to know?";
  }

  if (lowerMessage.includes("thank")) {
    return "You're welcome! If you have any more security questions, feel free to ask.";
  }

  // Default response
  return "I'm your AI security assistant. I can provide information about password security, account protection, and our security features. How can I assist you today?";
};

const SecureChat = ({
  isAuthenticated = true,
  username = "User",
  onLogout = () => {},
}: SecureChatProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [messages, setMessages] = useState<any[]>([
    {
      id: "welcome-1",
      senderId: "system",
      senderName: "System",
      senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=system",
      content:
        "Welcome to the secure chat. Your messages are end-to-end encrypted.",
      timestamp: new Date(),
      isCurrentUser: false,
    },
  ]);
  const [aiMessages, setAiMessages] = useState<any[]>([
    {
      id: "ai-welcome",
      senderId: "ai",
      senderName: "AI Assistant",
      senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=aibot",
      content:
        "Hello! I'm your AI security assistant. How can I help you today?",
      timestamp: new Date(),
      isCurrentUser: false,
    },
  ]);

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message to a backend
    const newMessage = {
      id: Date.now().toString(),
      senderId: "currentUser",
      senderName: user?.username || username,
      senderAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser",
      content: message,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    if (activeTab === "general") {
      setMessages((prev) => [...prev, newMessage]);

      // Simulate receiving a response after a short delay
      setTimeout(() => {
        const responseMessage = {
          id: (Date.now() + 1).toString(),
          senderId: "chatbot",
          senderName: "Security Bot",
          senderAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=securityBot",
          content:
            "Your message has been securely delivered. Remember to keep your password strong and never share it with anyone.",
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000);
    } else if (activeTab === "ai") {
      // Add user message to AI chat
      setAiMessages((prev) => [...prev, newMessage]);

      // Generate AI response
      setTimeout(() => {
        const aiResponse = {
          id: `ai-${Date.now() + 1}`,
          senderId: "ai",
          senderName: "AI Assistant",
          senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=aibot",
          content: generateAIResponse(message),
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setAiMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Lock className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Secure Area</h2>
          <p className="text-gray-600 mb-6">
            You need to be authenticated to access the secure chat.
          </p>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please log in or sign up to access this secure area.
            </AlertDescription>
          </Alert>
          <Button variant="default" size="lg">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col bg-background border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-primary/10 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Secure Chat</CardTitle>
            <Badge
              variant="outline"
              className="ml-2 bg-green-100 text-green-800 border-green-200"
            >
              Encrypted
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden">
        <Tabs
          defaultValue="general"
          className="h-full flex flex-col"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="px-6 pt-2 border-b">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-background"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="data-[state=active]:bg-background"
              >
                AI Assistant
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="data-[state=active]:bg-background"
              >
                Support
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-background"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="general"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages.length > 0 ? messages : undefined}
                  className="h-full"
                />
              </div>
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Type your message securely..."
              />
            </TabsContent>

            <TabsContent
              value="ai"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden">
                <MessageList messages={aiMessages} className="h-full" />
              </div>
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Ask the AI assistant about security..."
              />
            </TabsContent>

            <TabsContent
              value="support"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={[
                    {
                      id: "support-1",
                      senderId: "support",
                      senderName: "Support Agent",
                      senderAvatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
                      content:
                        "Hello! How can I help you with your password or security questions today?",
                      timestamp: new Date(Date.now() - 60000),
                      isCurrentUser: false,
                    },
                  ]}
                  className="h-full"
                />
              </div>
              <MessageInput
                placeholder="Ask for support here..."
                onSendMessage={(msg) => handleSendMessage(msg)}
              />
            </TabsContent>

            <TabsContent
              value="security"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={[
                    {
                      id: "security-1",
                      senderId: "security",
                      senderName: "Security Advisor",
                      senderAvatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=security",
                      content:
                        "Welcome to the security channel. Here you can discuss password best practices and get advice on keeping your account secure.",
                      timestamp: new Date(Date.now() - 120000),
                      isCurrentUser: false,
                    },
                  ]}
                  className="h-full"
                />
              </div>
              <MessageInput
                placeholder="Ask security questions here..."
                onSendMessage={(msg) => handleSendMessage(msg)}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default SecureChat;
