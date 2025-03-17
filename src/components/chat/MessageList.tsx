import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface MessageListProps {
  messages?: Message[];
  className?: string;
}

const MessageList = ({
  messages = [
    {
      id: "1",
      senderId: "user1",
      senderName: "Alice Smith",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      content: "Hey there! How are you doing today?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      isCurrentUser: false,
    },
    {
      id: "2",
      senderId: "currentUser",
      senderName: "You",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      content:
        "I'm doing great! Just finished setting up my new secure password.",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: true,
    },
    {
      id: "3",
      senderId: "user1",
      senderName: "Alice Smith",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      content:
        "That's awesome! The password strength analyzer is really helpful, isn't it?",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false,
    },
    {
      id: "4",
      senderId: "currentUser",
      senderName: "You",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      content:
        "Absolutely! It helped me create a much stronger password than I would have on my own.",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: true,
    },
    {
      id: "5",
      senderId: "user1",
      senderName: "Alice Smith",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      content:
        "Security is so important these days. Glad you're taking it seriously!",
      timestamp: new Date(Date.now() - 300000),
      isCurrentUser: false,
    },
  ],
  className = "",
}: MessageListProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`w-full h-full bg-gray-50 ${className}`}>
      <ScrollArea className="h-full p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage
                    src={message.senderAvatar}
                    alt={message.senderName}
                  />
                  <AvatarFallback>
                    {message.senderName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${message.isCurrentUser ? "items-end mr-2" : "items-start ml-2"}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {message.isCurrentUser ? "You" : message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`mt-1 p-3 rounded-lg ${
                      message.isCurrentUser
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
