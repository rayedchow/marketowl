"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface ChatObject {
  id: number;
  text: string;
  prediction: string;
  tone: string;
}

export default function NearbySellers() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatObject[]>([
    {
      id: 1,
      text: '"Hey! Can you tell me more about your item?"',
      prediction: "85% likelihood of response",
      tone: "Inquisitive",
    },
  ]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event: MessageEvent) => {
      const newMessage: ChatObject = {
        id: Date.now(),
        text: event.data,
        prediction: "Unknown",
        tone: "Unknown",
      };
      setMessages([newMessage]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // When a suggestion's "Send Message" is clicked, send only the message text to the backend.
  const handleSendMessage = (message: ChatObject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message.text);
    }
  };

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Best Messages to Send</h2>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-lg">{message.text}</div>
                <div className="text-gray-400">{message.prediction}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-gray-400">Tone: {message.tone}</div>
                <button
                  onClick={() => handleSendMessage(message)}
                  className="text-purple-500 hover:text-purple-400 text-sm"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
