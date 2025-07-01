import React, { useState } from "react";
import { motion } from "framer-motion";
import { Integration, WorkflowNode } from "@shared/types";
import { INTEGRATIONS, getIntegrationsByCategory } from "@/lib/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MessageCircle,
  Globe,
  FileSpreadsheet,
  CreditCard,
  Webhook,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationsPanelProps {
  onAddNode: (
    integration: Integration,
    position: { x: number; y: number },
  ) => void;
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

export default function IntegrationsPanel({
  onAddNode,
}: IntegrationsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredIntegrations = INTEGRATIONS.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeTab === "all" || integration.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (
    integration: Integration,
    event: React.DragEvent,
  ) => {
    event.dataTransfer.setData("integration", JSON.stringify(integration));
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleAddIntegration = (integration: Integration) => {
    // Add at a random position in the canvas
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };
    onAddNode(integration, position);
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const IconComponent = iconMap[integration.type] || Globe;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className="cursor-grab hover:shadow-md transition-all duration-200 border-l-4"
          style={{ borderLeftColor: integration.color }}
          draggable
          onDragStart={(e) => handleDragStart(integration, e)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: `${integration.color}20`,
                  color: integration.color,
                }}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {integration.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-xs flex-shrink-0"
                    style={{
                      backgroundColor: `${integration.color}15`,
                      color: integration.color,
                    }}
                  >
                    {integration.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {integration.description}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs w-full justify-center"
                  onClick={() => handleAddIntegration(integration)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add to Workflow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Integrations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="trigger" className="text-xs">
              Triggers
            </TabsTrigger>
            <TabsTrigger value="action" className="text-xs">
              Actions
            </TabsTrigger>
            <TabsTrigger value="logic" className="text-xs">
              Logic
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-3 overflow-y-auto h-full pr-2">
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm">No integrations found</p>
                  <p className="text-xs">Try adjusting your search</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <div className="p-4 border-t bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">
          Drag & drop integrations to the canvas or click "Add to Workflow"
        </p>
      </div>
    </div>
  );
}
