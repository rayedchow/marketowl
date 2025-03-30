"use client";

import { useEffect, useState } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  type: "root" | "buyer" | "seller";
  intensity: number;
  active: boolean;
  shade?: number;
  label?: string;
}

export default function AlgorithmGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const generateNodes = () => {
      const newNodes: Node[] = [];

      // Root node (Facebook conversation)
      newNodes.push({
        id: "root",
        x: 100,
        y: 100,
        type: "root",
        intensity: 1,
        active: true,
        label: "Existing Conversation",
      });

      // Layer 1: 3 example buyer nodes
      for (let i = 0; i < 3; i++) {
        newNodes.push({
          id: `l1-${i}`,
          x: 250 + i * 100,
          y: 100,
          type: "buyer",
          intensity: 0,
          active: false,
          label: i === 1 ? "10 Possible\nBuyer Messages" : "",
        });
      }

      // Layer 2: 3 seller nodes (from middle buyer)
      for (let i = 0; i < 3; i++) {
        newNodes.push({
          id: `l2-${i}`,
          x: 350,
          y: 200 + i * 80,
          type: "seller",
          intensity: 0,
          active: false,
          shade: i,
          label: i === 1 ? "3 Seller\nResponses Each" : "",
        });
      }

      // Layer 3: 3 buyer nodes (from middle seller)
      for (let i = 0; i < 3; i++) {
        newNodes.push({
          id: `l3-${i}`,
          x: 500,
          y: 280 + i * 60,
          type: "buyer",
          intensity: 0,
          active: false,
          label: i === 1 ? "3 Buyer\nResponses Each" : "",
        });
      }

      // Layer 4: 3 seller nodes (from middle buyer)
      for (let i = 0; i < 3; i++) {
        newNodes.push({
          id: `l4-${i}`,
          x: 650,
          y: 320 + i * 40,
          type: "seller",
          intensity: 0,
          active: false,
          shade: i,
          label: i === 1 ? "3 Seller\nResponses Each" : "",
        });
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

        newNodes.forEach((node) => {
          if (node.intensity < 1 && node.active) {
            node.intensity = Math.min(1, node.intensity + 0.1);
            shouldContinue = true;
          }
        });

        const layers = [
          [newNodes[0]], // root
          newNodes.slice(1, 4), // layer 1
          newNodes.slice(4, 7), // layer 2
          newNodes.slice(7, 10), // layer 3
          newNodes.slice(10), // layer 4
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

  const getNodeColor = (node: Node) => {
    if (node.type === "root") return "#347fc4";
    if (node.type === "buyer") return "#4ade80";
    const colors = [
      "rgba(255, 99, 99, 0.9)",
      "rgba(255, 50, 50, 0.9)",
      "rgba(200, 0, 0, 0.9)",
    ];
    return colors[node.shade || 0];
  };

  return (
    <div className="w-full bg-[#272838] rounded-xl p-6 border border-[#7d6b91]/30 mt-6">
      <h3 className="text-lg font-semibold text-[#989fce] mb-4">
        Algorithm Design
      </h3>
      <div className="relative w-full h-[500px] overflow-x-auto">
        <svg width="800" height="500" className="mx-auto">
          {/* Draw connecting lines */}
          {nodes.map((node, i) => {
            if (i === 0) return null;
            let parentIndex;
            if (i <= 3) {
              // Layer 1
              parentIndex = 0;
            } else if (i <= 6) {
              // Layer 2
              parentIndex = 2; // Connect to middle buyer node
            } else if (i <= 9) {
              // Layer 3
              parentIndex = 5; // Connect to middle seller node
            } else {
              // Layer 4
              parentIndex = 8; // Connect to middle buyer node
            }
            const parent = nodes[parentIndex];
            return (
              <line
                key={`line-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={`rgba(152,159,206,${node.intensity * 0.3})`}
                strokeWidth="2"
                strokeDasharray="4"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={getNodeColor(node)}
                opacity={node.intensity}
                className="transition-all duration-300"
              />
              {node.label && (
                <text
                  x={node.x}
                  y={node.type === "root" ? node.y - 40 : node.y + 40}
                  textAnchor="middle"
                  fill="#989fce"
                  opacity={node.intensity}
                  className="text-sm"
                >
                  {node.label.split("\n").map((line, i) => (
                    <tspan key={i} x={node.x} dy={i === 0 ? 0 : 20}>
                      {line}
                    </tspan>
                  ))}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
