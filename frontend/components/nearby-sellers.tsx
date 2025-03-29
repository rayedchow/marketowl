import Image from "next/image"
import { User } from "lucide-react"

const sellers = [
  {
    id: 1,
    product: "Smattwvatch",
    seller: "Jacob Keiler",
    location: "Jaob",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    product: "Laptop Stand",
    seller: "Brooke Owens",
    location: "Brooke",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    product: "Headphones",
    seller: "Ethan Parker",
    location: "Ethan",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function NearbySellers() {
  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Nearby Sellers</h2>
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
              <a href="#" className="text-purple-500 hover:text-purple-400 text-sm">
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

