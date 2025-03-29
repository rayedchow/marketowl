import Image from "next/image"
import { User } from "lucide-react"
import { useState } from "react"

const sellers = [
  {
    id: 1,
    product: "Stained",
    seller: "Lower Value",
    location: "-2",
    image: "/placeholder.svg?height=80&width=80",
    details: "The shirt shows noticeable staining in the armpit area, which affects its overall appearance and value. The stains appear to be sweat-related and may require professional cleaning to remove. This type of imperfection typically reduces the item's resale value."
  },
  {
    id: 2,
    product: "Used like - Good",
    seller: "Lower Value",
    location: "-2",
    image: "/placeholder.svg?height=80&width=80",
    details: "The item is in good used condition with minor signs of wear from regular use. There may be slight fading or minimal pilling, but no significant damage or stains. While used, it maintains its functionality and basic aesthetic appeal."
  },
  {
    id: 3,
    product: "Anitque/Rare",
    seller: "Positive Value",
    location: "+3",
    image: "/placeholder.svg?height=80&width=80",
    details: "This is a rare vintage piece with historical significance. Despite its age, it maintains excellent condition with authentic period details and craftsmanship. The rarity and antique status actually increase its value above similar modern items."
  },
]

export default function Attributes() {
  const [selectedSeller, setSelectedSeller] = useState<number | null>(null)

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Keep In Mind!</h2>
      </div>

      <div className="space-y-4">
        {sellers.map((seller) => (
          <div key={seller.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1a1a2e] rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src={seller.image || "/placeholder.svg"}
                  alt={seller.product}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{seller.product}</div>
                <div className="text-gray-400">{seller.seller}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-400">{seller.location}</div>
              <button
                onClick={() => setSelectedSeller(selectedSeller === seller.id ? null : seller.id)}
                className="text-purple-500 hover:text-purple-400 text-sm"
              >
                {selectedSeller === seller.id ? "Hide Details" : "View Details"}
              </button>
              {selectedSeller === seller.id && (
                <div className="absolute left-0 right-0 mt-2 p-4 bg-[#1a1a2e] rounded-lg border border-purple-900/50 shadow-lg">
                  <p className="text-gray-300 text-sm">{seller.details}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

