"use client";

import ConversationInsights from "@/components/conversation-insights";
import NearbySellers from "@/components/message-suggestions";
import Attributes from "@/components/item-notes";
import Bar from "@/components/bar";
import MessagePropagation from "@/components/message-propagation";
import AlgorithmGraph from "@/components/algorithm-graph";
import Image from "next/image";

export default function Home() {
  // Define the conversation score to be used in both components
  const conversationScore = 0.55;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a2f] to-[#1c1c35] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-purple-300/10">
        <div className="flex items-center gap-3">
          <Image
            src="/market-owl-logo.png"
            alt="Market Owl Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
            Market Owl
          </h1>
        </div>
        <div className="flex items-center gap-4"></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 p-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-8 w-full">
          <Bar />
          <div className=" gap-8">
            <AlgorithmGraph />
            <MessagePropagation />
          </div>
          <ConversationInsights score={conversationScore} />
          <NearbySellers />
          <Attributes />
        </div>
      </main>
    </div>
  );
}
