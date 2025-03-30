"use client";

import { useEffect, useState } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  type: "buyer" | "seller";
  intensity: number; // 0 to 1, affects opacity
  active: boolean;
  shade?: number; // 0-2 for different shades of red for sellers
}

export default function MessagePropagation() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Generate nodes for each layer
    const generateNodes = () => {
      const newNodes: Node[] = [];
      const spacing = 60;

      // Root node (Facebook conversation)
      newNodes.push({
        id: "root",
        x: 400,
        y: 50,
        type: "seller",
        intensity: 1,
        active: true,
        shade: 1,
      });

      // Layer 1 (10 buyer messages)
      const layer1Count = 10;
      for (let i = 0; i < layer1Count; i++) {
        newNodes.push({
          id: `l1-${i}`,
          x: 100 + i * spacing,
          y: 150,
          type: "buyer",
          intensity: 0,
          active: false,
        });
      }

      // Layer 2 (30 seller messages - 3 per buyer)
      for (let i = 0; i < layer1Count; i++) {
        for (let j = 0; j < 3; j++) {
          newNodes.push({
            id: `l2-${i}-${j}`,
            x: 85 + i * spacing + j * 20,
            y: 250,
            type: "seller",
            intensity: 0,
            active: false,
            shade: j, // Different shades of red
          });
        }
      }

      // Layer 3 (90 buyer messages - 3 per seller)
      for (let i = 0; i < layer1Count * 3; i++) {
        for (let j = 0; j < 3; j++) {
          newNodes.push({
            id: `l3-${i}-${j}`,
            x: 80 + i * (spacing / 3) + j * 7,
            y: 350,
            type: "buyer",
            intensity: 0,
            active: false,
          });
        }
      }

      // Layer 4 (270 seller messages - 3 per buyer)
      for (let i = 0; i < layer1Count * 9; i++) {
        for (let j = 0; j < 3; j++) {
          newNodes.push({
            id: `l4-${i}-${j}`,
            x: 75 + i * (spacing / 9) + j * 3,
            y: 450,
            type: "seller",
            intensity: 0,
            active: false,
            shade: j,
          });
        }
      }

      return newNodes;
    };

    setNodes(generateNodes());
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    const animateNodes = () => {
      setNodes((prev) => {
        const newNodes = [...prev];
        let shouldContinue = false;

        // Activate nodes layer by layer
        newNodes.forEach((node) => {
          if (node.intensity < 1 && node.active) {
            node.intensity = Math.min(1, node.intensity + 0.1);
            shouldContinue = true;
          }
        });

        // Activate next layer if current layer is fully visible
        const layers = [
          [newNodes[0]], // root
          newNodes.slice(1, 11), // layer 1 (10 buyers)
          newNodes.slice(11, 41), // layer 2 (30 sellers)
          newNodes.slice(41, 311), // layer 3 (90 buyers)
          newNodes.slice(311), // layer 4 (270 sellers)
        ];

        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          const isLayerComplete = layer.every((node) => node.intensity === 1);

          if (isLayerComplete && i < layers.length - 1) {
            layers[i + 1].forEach((node) => {
              if (!node.active) {
                node.active = true;
                shouldContinue = true;
              }
            });
          }
        }

        if (!shouldContinue) {
          setIsAnimating(false);
        }

        return newNodes;
      });
    };

    const interval = setInterval(animateNodes, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getSellerColor = (shade: number = 0) => {
    const colors = [
      "rgba(255, 99, 99, 0.9)", // Light red
      "rgba(255, 50, 50, 0.9)", // Medium red
      "rgba(200, 0, 0, 0.9)", // Dark red
    ];
    return colors[shade];
  };

  return (
    <div className="w-full bg-[#272838] rounded-xl p-6 border border-[#7d6b91]/30 mt-6">
      <h3 className="text-lg font-semibold text-[#989fce] mb-4">
        Message Propagation Visualization
      </h3>
      <div className="relative w-full h-[500px] overflow-x-auto">
        <svg width="1000" height="500" className="mx-auto">
          {/* Draw lines between connected nodes */}
          {nodes.map((node, i) => {
            if (i === 0) return null; // Skip root node
            let parentIndex;
            if (i <= 10) {
              // Layer 1
              parentIndex = 0;
            } else if (i <= 40) {
              // Layer 2
              parentIndex = Math.floor((i - 11) / 3) + 1;
            } else if (i <= 310) {
              // Layer 3
              parentIndex = Math.floor((i - 41) / 3) + 11;
            } else {
              // Layer 4
              parentIndex = Math.floor((i - 311) / 3) + 41;
            }
            const parent = nodes[parentIndex];
            return (
              <line
                key={`line-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={`rgba(152,159,206,${node.intensity * 0.15})`}
                strokeWidth="1"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={4}
                fill={
                    node.id === "root" 
                      ? "#347fc4" 
                      : node.type === "buyer" 
                        ? "#4ade80" 
                        : getSellerColor(node.shade)
                  }
                opacity={node.intensity}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
