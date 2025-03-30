"use client";

import { useEffect, useState } from "react";
import { User, Send } from "lucide-react";

export default function NearbySellers(props: { results: any }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // When a suggestion's "Send Message" is clicked, send only the message text to the backend.
  const handleSendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "send", message: message.message }));
    }
  };

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    // For values from -1 to 1
    // Negative values (red): -1 to 0
    // Positive values (green): 0 to 1
    // Neutral (gray): exactly 0
    
    if (score === 0) return '#4a5568'; // Neutral gray for zero
    
    if (score < 0) {
      // Red for negative values, more intense as it approaches -1
      const redIntensity = Math.min(1, Math.abs(score));
      return `rgba(239, 68, 68, ${redIntensity})`; // Red with varying opacity
    } else {
      // Green for positive values, more intense as it approaches 1
      return `rgba(34, 197, 94, ${score})`; // Green with varying opacity
    }
  };

  return (
    <div className="bg-[#0c0c1d] rounded-xl p-6 border border-purple-900/50 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold">Most Optimal Messages</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
            {props.results.algorithm_results.slice(0, 3).map((message: any) => (
            <div
              key={message.message}
              className="group flex py-2 px-3 border-b border-purple-900/20 last:border-0 hover:border-purple-500/30 transition-all duration-200 rounded-md hover:bg-purple-900/10 justify-between"
            >
              <div className="text-white/80 group-hover:text-white transition-colors max-w-[70%]">
                <em>"{message.message}"</em>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSendMessage(message)}
                  className="flex items-center gap-1 px-4 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-md transition-colors"
                >
                  <Send className="h-5 w-5" />
                  Send
                </button>
                <div 
                  className="px-3 py-2 rounded text-sm font-medium text-white"
                  style={{ 
                    backgroundColor: getScoreColor(message.average_score),
                    minWidth: '60px',
                    textAlign: 'center'
                  }}
                >
                  {parseFloat(message.average_score).toFixed(2)}
                </div>
              </div>
              {/* <div className="flex items-center justify-center w-full">
                <div className="flex-1 mr-3 flex items-center max-w-[70%]">
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    <em>"{message.message}"</em>
                  </div>
                </div>
                <button
                  onClick={() => handleSendMessage(message)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs transition-colors"
                >
                  <Send className="h-3 w-3" />
                  Send
                </button>
              </div>
              <div className="mt-2 self-end">
                <div 
                  className="px-3 py-2 rounded text-sm font-medium text-white"
                  style={{ 
                    backgroundColor: getScoreColor(message.average_score),
                    minWidth: '60px',
                    textAlign: 'center'
                  }}
                >
                  {parseFloat(message.average_score).toFixed(2)}
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
