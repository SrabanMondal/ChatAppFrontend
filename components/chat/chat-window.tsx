// chat-window.tsx
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, X } from "lucide-react";
import { useSocket } from "@/lib/socket-context";
import { UserData } from "@/lib/apis/chat";
import { getProfile } from "@/lib/apis/user";

// Interface for the message structure
export interface Message {
  _id?: string;
  roomId: string;
  senderId: number;
  senderName: string;
  content: string;
  type: "text" | "image" | "video";
  status: "sending" | "sent" | "delivered" | "seen";
  createdAt?: string;
  updatedAt?: string;
}

interface ChatWindowProps {
  friend: UserData;
  userId: number;
  onClose: () => void;
  onlineIds: Set<number> | null;
}

export function ChatWindow({ friend, userId, onClose, onlineIds }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const [name, setName] = useState("");

  // Scroll to bottom utility
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getProfile();
      if (response) {
        setName(response.mongoUser.name);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (onlineIds) {
      //console.log(onlineIds, friend.id);
      setStatus(onlineIds.has(friend.id));
    }
  }, [onlineIds]);

  // Socket listeners and room management (unchanged)
  useEffect(() => {
    if (!socket || !isConnected) {
      //console.log("ChatWindow Effect: Socket not available or not connected.");
      return;
    }

    //console.log(`ChatWindow Effect: Setting up for friend ID: ${friend.id}, User ID: ${userId}`);

    socket.emit("joinRoom", { recieverId: friend.id });

    const handleRoomJoined = (data: { roomId: string; participants: any[] }) => {
      //console.log(`Event 'roomJoined': Successfully joined room: ${data.roomId}`);
      setRoomId(data.roomId);
      setMessages([]);
    };

    const handleChatHistory = (history: Message[]) => {
      //console.log(`Event 'chatHistory': Received history for room ${roomId} (${history?.length || 0} messages)`);
      setMessages(history || []);
      if (history && history?.length > 0 && roomId) {
        history.forEach((msg) => {
          if (msg.senderId === friend.id && msg._id && msg.status !== "seen") {
            //console.log(`ChatWindow: Marking historical message as read on load: ${msg._id}`);
            socket.emit("readMessage", { message: msg });
          }
        });
      }
      setTimeout(scrollToBottom, 0);
    };

    const handleNewMessage = (newMessage: Message) => {
      //console.log(`Event 'sendMessage': Received new message ID ${newMessage._id || "(no id yet)"} from ${newMessage.senderId}`);
      setMessages((prevMessages) => {
        if (newMessage._id && prevMessages.some((msg) => msg._id === newMessage._id)) {
          return prevMessages.map((msg) => (msg._id === newMessage._id ? newMessage : msg));
        }
        return [...prevMessages, newMessage];
      });

      if (newMessage.senderId === friend.id && newMessage._id && roomId) {
        //console.log(`ChatWindow: Emitting 'readMessage' for message ID: ${newMessage._id}`);
        socket.emit("readMessage", { message: newMessage });
      }

      if (newMessage.senderId === friend.id) {
        setIsTyping(false);
      }
      setTimeout(scrollToBottom, 0);
    };

    const handleMessageSent = (sentMessage: Message) => {
      //console.log(`Event 'messageSent': Confirmation for message ID ${sentMessage._id}`);
      setMessages((prev) =>
        prev.map((msg) =>
          (msg._id === sentMessage._id ||
          (msg.status === "sending" && msg.senderId === sentMessage.senderId && msg.content === sentMessage.content))
            ? { ...sentMessage, status: sentMessage.status || "sent" }
            : msg
        )
      );
    };

    const handleTypingIndicator = (data: { userId: number; isTyping: boolean }) => {
      if (data.userId === friend.id) {
        setIsTyping(data.isTyping);
      }
    };

    const handleBulkSeenOnJoin = (data: { recieverId: number; roomId: string; userId: number }) => {
      //console.log(`Event 'seenMessages': Received bulk seen notification. Data:`, data);
      if (data.roomId === roomId && data.userId === friend.id && data.recieverId === userId) {
        //console.log(`ChatWindow: Applying bulk seen status update triggered by friend ${friend.id} joining room ${roomId}.`);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            (msg.senderId === userId && msg.status !== "seen") ? { ...msg, status: "seen" } : msg
          )
        );
      }
    };

    const handleSingleMessageSeen = (updatedMessage: Message) => {
      //console.log(`Event 'messageSeen': Received single message seen update. Data:`, updatedMessage);
      if (updatedMessage.roomId === roomId && updatedMessage.senderId === userId && updatedMessage.status !== "seen") {
        //console.log(`ChatWindow: Applying single message seen status for message ID: ${updatedMessage._id}`);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            (msg._id === updatedMessage._id) ? { ...msg, status: "seen" } : msg
          )
        );
      }
    };

    const handleRoomLeft = (data: { roomId: string; message: string }) => {
      //console.log(`Event 'roomLeft': Confirmation: ${data.message}`);
    };

    socket.on("roomJoined", handleRoomJoined);
    socket.on("chatHistory", handleChatHistory);
    socket.on("sendMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("typing", handleTypingIndicator);
    socket.on("seenMessages", handleBulkSeenOnJoin);
    socket.on("messageSeen", handleSingleMessageSeen);
    socket.on("roomLeft", handleRoomLeft);

    return () => {
      //console.log(`ChatWindow Effect Cleanup: Removing listeners for room ${roomId}, friend ${friend.id}`);
      socket.off("roomJoined", handleRoomJoined);
      socket.off("chatHistory", handleChatHistory);
      socket.off("sendMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("typing", handleTypingIndicator);
      socket.off("seenMessages", handleBulkSeenOnJoin);
      socket.off("messageSeen", handleSingleMessageSeen);
      socket.off("roomLeft", handleRoomLeft);

      if (roomId) {
        //console.log(`ChatWindow Effect Cleanup: Emitting leaveRoom for room: ${roomId}`);
        socket.emit("leaveRoom", { roomId: roomId });
      }
    };
  }, [socket, isConnected, friend.id, userId, roomId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !isConnected || !roomId || !messageInput.trim()) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      roomId: roomId,
      senderId: userId,
      senderName: name,
      content: messageInput.trim(),
      type: "text",
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    //console.log("ChatWindow: Sending message (optimistic):", optimisticMessage);
    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageInput("");
    handleTypingChange(false);
    setTimeout(scrollToBottom, 0);

    socket.emit("sendMessage", {
      message: {
        roomId: optimisticMessage.roomId,
        senderId: optimisticMessage.senderId,
        senderName: optimisticMessage.senderName,
        content: optimisticMessage.content,
        type: optimisticMessage.type,
        status: "sent",
      },
      receiverId: friend.id,
    });
  };

  const handleTypingChange = (isTypingNow: boolean) => {
    if (socket && isConnected && roomId) {
      socket.emit("typing", { roomId: roomId, isTyping: isTypingNow });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    handleTypingChange(e.target.value?.length > 0);
  };

  return (
    <Card className="flex flex-col h-[500px] w-full border border-gray-900 rounded-lg shadow-lg overflow-hidden bg-gray-900">
      {/* Card Header */}
      <CardHeader className="p-4 border-b border-gray-900 flex flex-row items-center justify-between bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={friend.profilepic} alt={friend.name} />
              <AvatarFallback>{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {status ? (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-gray-800"></span>
            ) : (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 border-2 border-gray-800"></span>
            )}
          </div>
          <CardTitle className="text-lg font-medium text-gray-100">{friend.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat" className="text-gray-400 hover:text-gray-100">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Message Display Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-850">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 italic">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id || `msg-${message.senderId}-${message.createdAt || Date.now()}`}
              className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  message.senderId === userId
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <div
                  className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                    message.senderId === userId
                      ? "text-indigo-200 opacity-80"
                      : "text-gray-400"
                  }`}
                >
                  <span>
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Sending..."}
                  </span>
                  {message.senderId === userId && (
                    <span className="flex items-center" title={`Status: ${message.status}`}>
                      {message.status === "sending" && "⏳"}
                      {message.status === "sent" && "✓"}
                      {message.status === "delivered" && "✓✓"}
                      {message.status === "seen" && <span className="font-bold text-indigo-300">✓✓</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm italic shadow-sm">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2 items-center"
        >
          <Input
            value={messageInput}
            onChange={handleInputChange}
            onBlur={() => setTimeout(() => handleTypingChange(false), 200)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 text-gray-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageInput.trim() || !isConnected || !roomId}
            aria-label="Send message"
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}