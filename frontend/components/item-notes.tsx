import { AlertCircle, Tag } from "lucide-react";

export default function Attributes(props: { results: any }) {
  // Create flaws array from the results prop
  const flaws = props.results?.flaws?.defects?.map((flaw: string, index: number) => ({
    id: index + 1,
    product: flaw,
    seller: "Lower Value",
  })) || [];

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <Tag className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Flaws to Consider</h2>
      </div>

      <div className="space-y-4">
        {flaws.map((flaw: any) => (
          <div key={flaw.id} className="flex flex-col">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {flaw.product}
                  </div>
                  <div className="text-gray-400">{flaw.seller}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
