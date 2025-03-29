"use client"

import { Search } from "lucide-react"
import ChatInterface from "../../../components/chat-interface"
import ConversationInsights from "../../../components/conversation-insights"
import NearbySellers from "../../../components/nearby-sellers"

export default function ChatPage() {
  // Using a fixed score of 0.7 for the conversation insights
  const conversationScore = 0.7

  return (
    <div className="min-h-screen bg-[#070714] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a2e] px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">MarketOwl</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1a1a2e] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4 grid grid-cols-12 gap-4 h-[calc(100vh-73px)]">
        {/* Left sidebar */}
        <div className="col-span-3 flex flex-col gap-4">
          <ConversationInsights score={conversationScore} />
          <NearbySellers />
        </div>

        {/* Chat interface */}
        <div className="col-span-9 h-full">
          <ChatInterface conversationScore={conversationScore} />
        </div>
      </main>
    </div>
  )
}