"use client"

import ConversationInsights from "@/components/conversation-insights"
import NearbySellers from "@/components/message-suggestions"
import Attributes from "@/components/item-notes"
import Bar from "@/components/bar";

export default function Home() {
  // Define the conversation score to be used in both components
  const conversationScore = 0.55

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-bold">Market Owl</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 p-6 gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full">
          <Bar />
          <ConversationInsights score={conversationScore} />
          <NearbySellers />
          <Attributes />
        </div>
      </main>
    </div>
  )
}

