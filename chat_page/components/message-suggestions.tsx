import Image from "next/image"
import { User } from "lucide-react"

const messages = [
  {
    id: 1,
    message: '"Hey! Can you tell me more about your item?"',
    prediction: "85% likelihood of success",
    tone: "Inquisitive",
  },
]

export default function NearbySellers() {
  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Best Messages to Send</h2>
      </div>

      <div className="space-y-4">
        {messages.map((seller) => (
          <div key={seller.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-lg">{seller.message}</div>
                <div className="text-gray-400">{seller.prediction}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-gray-400">Tone: {seller.tone}</div>
                <a href="#" className="text-purple-500 hover:text-purple-400 text-sm">
                  Send Message
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

