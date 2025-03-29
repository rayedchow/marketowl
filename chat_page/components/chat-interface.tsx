"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

// Chat message type
type Message = {
  id: number
  sender: "user" | "bot"
  text: string
}

// Initial messages
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hello, How can I assist you today?",
  },
  {
    id: 2,
    sender: "user",
    text: "I'm looking for a new phone. Can you help me with that?",
  },
  {
    id: 3,
    sender: "bot",
    text: "Of course! What features are you looking for in a phone?",
  },
  {
    id: 4,
    sender: "user",
    text: "I'd like a good camera and long battery life.",
  },
  {
    id: 5,
    sender: "user",
    text: "What are the price ranges?",
  },
  {
    id: 6,
    sender: "user",
    text: "Do you have any recommendations?",
  },
]

interface ChatInterfaceProps {
  conversationScore?: number
}

export default function ChatInterface({ conversationScore = 0.65 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "user",
          text: newMessage,
        },
      ])
      setNewMessage("")
    }
  }

  // Calculate the height of the quality bar based on the score
  const qualityBarHeight = `${conversationScore * 100}%`

  return (
    <div className="bg-[#0c0c1d] rounded-xl h-full flex flex-col border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      {/* Chat header */}
      <div className="p-6 flex items-center gap-3 border-b border-[#1a1a2e]">
        <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#2a2a3e]"></div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Astra</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-400 text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Chat messages with quality bar */}
      <div className="flex-1 relative">
        {/* Quality indicator bar */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#1a1a2e] rounded-r-xl">
          <div
            className="absolute bottom-0 left-0 right-0 bg-purple-700 rounded-r-xl transition-all duration-1000 ease-in-out"
            style={{ height: qualityBarHeight }}
          >
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-purple-700 to-purple-500 opacity-50 rounded-r-xl"></div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 overflow-y-auto h-full space-y-4 pr-4">
          {messages.map((message) => (
            <div key={message.id} className={`max-w-md ${message.sender === "bot" ? "ml-0" : "ml-auto"}`}>
              <div
                className={`p-3 rounded-xl ${
                  message.sender === "bot" ? "bg-[#2a1a4a] text-white" : "bg-[#1a1a2e] text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="p-6 border-t border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#1a1a2e] rounded-xl flex items-center">
            <button className="p-3 text-purple-500">
              <Plus className="h-6 w-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none p-3 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

