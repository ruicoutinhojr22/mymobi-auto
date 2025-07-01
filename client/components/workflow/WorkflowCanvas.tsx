import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { WorkflowNode, WorkflowConnection } from "@shared/types";
import WorkflowNodeComponent from "./WorkflowNode";
import ConnectionLine from "./ConnectionLine";

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onConnectionsChange: (connections: WorkflowConnection[]) => void;
  onNodeSelect: (nodeId: string | null) => void;
  selectedNodeId: string | null;
}

export default function WorkflowCanvas({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
  selectedNodeId,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{
    sourceId: string;
    startPos: { x: number; y: number };
  } | null>(null);

  const handleNodeDragStart = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      setDraggedNode(nodeId);
      setDragOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      onNodeSelect(nodeId);
    },
    [nodes, onNodeSelect],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!draggedNode || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = event.clientX - canvasRect.left - dragOffset.x;
      const newY = event.clientY - canvasRect.top - dragOffset.y;

      const updatedNodes = nodes.map((node) =>
        node.id === draggedNode
          ? { ...node, position: { x: newX, y: newY } }
          : node,
      );

      onNodesChange(updatedNodes);
    },
    [draggedNode, dragOffset, nodes, onNodesChange],
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleConnectionStart = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      setConnecting({
        sourceId: nodeId,
        startPos: {
          x: node.position.x + 150, // Node width / 2
          y: node.position.y + 40, // Node height / 2
        },
      });
    },
    [nodes],
  );

  const handleConnectionEnd = useCallback(
    (targetNodeId: string) => {
      if (!connecting || connecting.sourceId === targetNodeId) {
        setConnecting(null);
        return;
      }

      // Check if connection already exists
      const existingConnection = connections.find(
        (conn) =>
          conn.source === connecting.sourceId && conn.target === targetNodeId,
      );

      if (!existingConnection) {
        const newConnection: WorkflowConnection = {
          id: `${connecting.sourceId}-${targetNodeId}`,
          source: connecting.sourceId,
          target: targetNodeId,
        };

        onConnectionsChange([...connections, newConnection]);
      }

      setConnecting(null);
    },
    [connecting, connections, onConnectionsChange],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onNodeSelect(null);
        setConnecting(null);
      }
    },
    [onNodeSelect],
  );

  return (
    <div
      ref={canvasRef}
      className="workflow-canvas relative w-full h-full overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection) => {
          const sourceNode = nodes.find((n) => n.id === connection.source);
          const targetNode = nodes.find((n) => n.id === connection.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <ConnectionLine
              key={connection.id}
              sourcePos={{
                x: sourceNode.position.x + 150,
                y: sourceNode.position.y + 40,
              }}
              targetPos={{
                x: targetNode.position.x + 150,
                y: targetNode.position.y + 40,
              }}
            />
          );
        })}

        {/* Temporary connection while dragging */}
        {connecting && (
          <ConnectionLine
            sourcePos={connecting.startPos}
            targetPos={connecting.startPos}
            isTemporary
          />
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <WorkflowNodeComponent
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          isDragging={draggedNode === node.id}
          onDragStart={(event) => handleNodeDragStart(node.id, event)}
          onConnectionStart={(event) => handleConnectionStart(node.id, event)}
          onConnectionEnd={() => handleConnectionEnd(node.id)}
        />
      ))}

      {/* Drop zone indicator */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: nodes.length === 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Start Building</h3>
            <p className="text-sm">
              Drag integrations from the sidebar to create your workflow
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
