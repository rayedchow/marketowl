import { useState } from "react"

export default function Bar(props: { onSubmit: (url: string) => void }) {
  const [listingUrl, setListingUrl] = useState<string>('')
  const [isUrlSubmitted, setIsUrlSubmitted] = useState(false)

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listingUrl.trim()) {
      props.onSubmit(listingUrl)
      setIsUrlSubmitted(true)
    }
  };

  const handleAnotherListing = () => {
    setListingUrl("");
    setIsUrlSubmitted(false);
  };
  return (
    <div className="rounded-xl">
      {!isUrlSubmitted ? (
        <form onSubmit={handleUrlSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="url"
              value={listingUrl}
              onChange={(e) => setListingUrl(e.target.value)}
              placeholder="Enter Listing URL"
              className="flex-1 bg-[#0c0c1d] rounded-lg px-4 py-2 text-gray-300 border border-purple-900/50 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleAnotherListing}
          className="mb-6 text-purple-500 hover:text-purple-400 transition-colors"
        >
          ← Another Listing?
        </button>
      )}
    </div>
  );
}
