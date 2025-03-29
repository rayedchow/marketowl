"use client"

import { Search } from "lucide-react"
import ConversationInsights from "@/components/conversation-insights"
import NearbySellers from "@/components/message-suggestions"
import Attributes from "@/components/item-notes"

export default function Home() {
  // Define the conversation score to be used in both components
  const conversationScore = 0.55

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-bold">Market Owl</h1>
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-purple-500" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#111122] border-none rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 p-6 gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full">
          <ConversationInsights score={conversationScore} />
          <NearbySellers />
          <Attributes />
        </div>
      </main>
    </div>
  )
}

