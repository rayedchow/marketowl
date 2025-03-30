import { useState, useEffect, useRef } from "react"

export default function Bar() {
  const [listingUrl, setListingUrl] = useState<string>('')
  const [isUrlSubmitted, setIsUrlSubmitted] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Initialize WebSocket connection
    console.log('starting WebSocket connection attempt')
    
    // Add connection retry logic
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8000/ws')
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connection established')
        }
        
        wsRef.current.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
          // Attempt to reconnect after 3 seconds if not intentionally closed
          if (!wsRef.current?.CLOSING) {
            setTimeout(connectWebSocket, 3000)
          }
        }
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error)
        }
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error)
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }
    }
    
    connectWebSocket()
    
    // Clean up WebSocket connection on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listingUrl.trim()) {
      // Send the URL to the WebSocket server
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'listing_url', url: listingUrl }))
        console.log('Sent URL to WebSocket server:', listingUrl)
      } else {
        console.error('WebSocket is not connected')
      }
      
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
