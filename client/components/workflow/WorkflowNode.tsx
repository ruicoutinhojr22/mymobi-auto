import React from "react";
import { motion } from "framer-motion";
import { WorkflowNode } from "@shared/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageCircle,
  Globe,
  FileSpreadsheet,
  CreditCard,
  Webhook,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowNodeProps {
  node: WorkflowNode;
  isSelected: boolean;
  isDragging: boolean;
  onDragStart: (event: React.MouseEvent) => void;
  onConnectionStart: (event: React.MouseEvent) => void;
  onConnectionEnd: () => void;
}

const iconMap = {
  gmail: Mail,
  slack: MessageCircle,
  http: Globe,
  sheets: FileSpreadsheet,
  paypal: CreditCard,
  webhook: Webhook,
  trigger: Webhook,
} as const;

export default function WorkflowNodeComponent({
  node,
  isSelected,
  isDragging,
  onDragStart,
  onConnectionStart,
  onConnectionEnd,
}: WorkflowNodeProps) {
  const IconComponent = iconMap[node.type] || Globe;

  return (
    <motion.div
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isDragging ? 50 : isSelected ? 40 : 30,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card
        className={cn(
          "workflow-node relative w-[300px] p-4 cursor-grab transition-all duration-200 hover:shadow-lg",
          isSelected && "ring-2 ring-primary shadow-lg",
          isDragging && "cursor-grabbing shadow-xl scale-105",
          `border-l-4 border-l-[${node.data.integration.color}]`,
        )}
        onMouseDown={onDragStart}
        onMouseEnter={onConnectionEnd}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${node.data.integration.color}20`,
              color: node.data.integration.color,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {node.data.label}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {node.data.integration.description}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-xs"
            style={{
              backgroundColor: `${node.data.integration.color}15`,
              color: node.data.integration.color,
            }}
          >
            {node.data.integration.category}
          </Badge>
        </div>

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>
            {Object.keys(node.data.config).length > 0
              ? "Configured"
              : "Not configured"}
          </span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        {/* Connection Points */}
        {node.data.integration.category !== "trigger" && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <div className="w-3 h-3 bg-background border-2 border-muted-foreground rounded-full hover:border-primary transition-colors" />
          </div>
        )}

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 bg-background border-2 border-muted-foreground rounded-full hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
            onMouseDown={(e) => {
              e.stopPropagation();
              onConnectionStart(e);
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Card>
    </motion.div>
  );
}
