"use client";

import ConversationInsights from "@/components/conversation-insights";
import NearbySellers from "@/components/message-suggestions";
import Attributes from "@/components/item-notes";
import Bar from "@/components/bar";
import MessagePropagation from "@/components/message-propagation";
import AlgorithmGraph from "@/components/algorithm-graph";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react"; // Import the refresh icon

export default function Home() {
  // Define the conversation score to be used in both components
  const [conversationScore, setConversationScore] = useState(0.55);
  const [url, setUrl] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [gotResults, setGotResults] = useState(false);
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    // Connection opened
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    // Listen for messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      
      // Handle different event types
      if (data.type === 'score_update') {
        setConversationScore(data.score);
      } if(data.type === 'results') {
        setGotResults(true);
        setResults(data);
      }
      // Add more event handlers as needed
    };
    
    // Handle errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Handle connection close
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    // Set the socket in state
    setSocket(ws);
    
    // Clean up the WebSocket connection when component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);
  
  const handleSimulate = () => {
    // Simulate the conversation score change
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'simulate', url }));
    }
  }

  // Function to refresh the page
  const handleRestart = () => {
    window.location.reload();
  };

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
        <div className="flex items-center gap-4">
          {gotResults && (
            <button 
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 p-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-2 w-full">
          {gotResults ? 
            <>
              <ConversationInsights score={results.engagement/100} />
              <Attributes results={results} />
              <NearbySellers results={results} />
            </> : <>
              <Bar onSubmit={(url) => setUrl(url)} />
              <AlgorithmGraph onSimulate={handleSimulate} />
            </>
          }
        </div>
      </main>
    </div>
  );
}
