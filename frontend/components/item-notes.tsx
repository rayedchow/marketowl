import { User, AlertCircle, Tag, Star } from "lucide-react";
import { useState } from "react";

const sellers = [
  {
    id: 1,
    product: "Appears Stained",
    seller: "Lower Value",
    location: "-2",
    icon: AlertCircle,
    details:
      "The shirt shows noticeable staining in the armpit area, which affects its overall appearance and value. This type of imperfection typically reduces the item's resale value.",
  },
  {
    id: 2,
    product: 'Listed as "Used - Like New"',
    seller: "Lower Value",
    location: "-2",
    icon: Tag,
    details:
      "The item is in good used condition with minor signs of wear from regular use. There may be slight fading or minimal pilling, but no significant damage or stains. ",
  },
  {
    id: 3,
    product: "This item is Anitque/Rare",
    seller: "Increased Value",
    location: "+3",
    icon: Star,
    details:
      "This item does not appear frequently on Facebook Marketplace. You may not be able to find similar items elsewhere.",
  },
];

export default function Attributes() {
  const [selectedSeller, setSelectedSeller] = useState<number | null>(null);

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Item Notes to Consider</h2>
      </div>

      <div className="space-y-4">
        {sellers.map((seller) => {
          const Icon = seller.icon;
          return (
            <div key={seller.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {seller.product}
                    </div>
                    <div className="text-gray-400">{seller.seller}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${
                      seller.location.startsWith("+")
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {seller.location}
                  </div>
                  <button
                    onClick={() =>
                      setSelectedSeller(
                        selectedSeller === seller.id ? null : seller.id
                      )
                    }
                    className="text-purple-500 hover:text-purple-400 text-sm"
                  >
                    {selectedSeller === seller.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
              {selectedSeller === seller.id && (
                <div className="mt-4 p-4 bg-[#0c0c1d] rounded-lg border border-purple-900/50 transition-all duration-300 ease-in-out">
                  <p className="text-gray-300 text-sm">{seller.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
