"use client";

import { useEffect, useState } from "react";

interface GridCell {
  id: string;
  value: number;
  color: string;
}

export default function AlgorithmGraph(props: { onSimulate: () => void }) {
  const [cells, setCells] = useState<GridCell[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize grid with fewer columns for better fit
  useEffect(() => {
    const rows = 6;
    const cols = 8; // Reduced from 12 to 8 columns
    const initialCells: GridCell[] = [];
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        initialCells.push({
          id: `cell-${i}-${j}`,
          value: 0,
          color: '#4a5568' // Neutral starting color
        });
      }
    }
    
    setCells(initialCells);
  }, []);
  
  // Setup WebSocket connection
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws'); // Replace with your actual WebSocket endpoint
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data).data;
        
        // Check for score parameter in the data
        if (typeof data.score === 'number') {
          console.log(data.score);
          updateRandomCell(Math.round(data.score*100)/100);
          setIsLoading(false); // Turn off loading when response received
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        setIsLoading(false); // Turn off loading on error too
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  // Function to update a random cell
  const updateRandomCell = (score: number) => {
    const rows = 6;
    const cols = 8;
    
    // Generate random row and column
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    const cellIndex = randomRow * cols + randomCol;
    
    // Update the grid cells
    setCells(prevCells => {
      const newCells = [...prevCells];
      if (cellIndex < newCells.length) {
        const color = getColorForValue(score);
        newCells[cellIndex] = {
          ...newCells[cellIndex],
          value: score,
          color: color
        };
      }
      return newCells;
    });
  };
  
  // Helper function to generate color based on value
  const getColorForValue = (intensity: number) => {
    // For values from -1 to 1
    // Negative values (red): -1 to 0
    // Positive values (green): 0 to 1
    // Neutral (gray): exactly 0
    
    if (intensity === 0) return '#4a5568'; // Neutral gray for zero
    
    if (intensity < 0) {
      // Red for negative values, more intense as it approaches -1
      const redIntensity = Math.min(1, Math.abs(intensity));
      return `rgba(239, 68, 68, ${redIntensity})`; // Red with varying opacity
    } else {
      // Green for positive values, more intense as it approaches 1
      return `rgba(34, 197, 94, ${intensity})`; // Green with varying opacity
    }
  };

  // Function to handle simulation button click
  const handleSimulate = () => {
    setIsLoading(true); // Set loading state to true when button is clicked
    props.onSimulate(); // Call the provided onSimulate function
  };

  return (
    <div className="w-full bg-[#272838] rounded-xl p-4 border border-[#7d6b91]/30">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[#989fce]">
          Owl's Nest
        </h3>
        {/* Button with loading state */}
        {isLoading ? (
          <div className="px-2 py-1 bg-indigo-600 text-white text-xs rounded flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <button 
            onClick={handleSimulate}
            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
          >
            Simulate
          </button>
        )}
      </div>
      
      <div className="relative w-full overflow-hidden">
        <div className="grid grid-cols-8 gap-1 mx-auto">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="aspect-square flex items-center justify-center rounded-md transition-all duration-300 ease-in-out"
              style={{ 
                backgroundColor: cell.color,
                minWidth: '30px',
                minHeight: '30px',
                width: '100%'
              }}
            >
              <span className="text-white font-mono font-bold text-xs">
                {cell.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
