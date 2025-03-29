"use client"

import { BarChart3 } from "lucide-react"

interface ConversationInsightsProps {
  score: number
}

export default function ConversationInsights({ score }: ConversationInsightsProps) {
  // Calculate the percentage for the circle
  const percentage = score * 100
  const circumference = 2 * Math.PI * 50 // r = 50
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Conversation Insights</h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl font-bold">{score.toFixed(2)}</div>
          <div className="text-gray-400 mt-2">Engagement score</div>
        </div>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a2e" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

