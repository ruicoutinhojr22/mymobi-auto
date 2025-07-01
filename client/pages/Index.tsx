import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { WorkflowNode, WorkflowConnection, Integration } from "@shared/types";
import { INTEGRATIONS, getIntegrationById } from "@/lib/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import IntegrationsPanel from "@/components/workflow/IntegrationsPanel";
import StepConfigPanel from "@/components/workflow/StepConfigPanel";
import {
  Play,
  Save,
  Download,
  Upload,
  Settings,
  Zap,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId) || null
    : null;

  const handleAddNode = useCallback(
    (integration: Integration, position: { x: number; y: number }) => {
      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: integration.type,
        position,
        data: {
          label: integration.name,
          integration,
          config: {},
        },
      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
    },
    [],
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node,
        ),
      );
    },
    [],
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setConnections((prev) =>
      prev.filter((conn) => conn.source !== nodeId && conn.target !== nodeId),
    );
    setSelectedNodeId(null);
  }, []);

  const handleSaveWorkflow = useCallback(() => {
    const workflow = {
      name: workflowName,
      nodes,
      connections,
      isActive: false,
    };

    // For now, just download as JSON
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${workflowName.replace(/\s+/g, "_")}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [workflowName, nodes, connections]);

  const handleLoadWorkflow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target?.result as string);
          setWorkflowName(workflow.name || "Imported Workflow");
          setNodes(workflow.nodes || []);
          setConnections(workflow.connections || []);
          setSelectedNodeId(null);
        } catch (error) {
          alert("Failed to load workflow. Please check the file format.");
        }
      };
      reader.readAsText(file);

      // Reset the input
      event.target.value = "";
    },
    [],
  );

  const handlePlayWorkflow = useCallback(() => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would trigger workflow execution
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000); // Demo: auto-stop after 3 seconds
    }
  }, [isPlaying]);

  const canvasDropHandler = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const integrationData = event.dataTransfer.getData("integration");
      if (!integrationData) return;

      try {
        const integration = JSON.parse(integrationData) as Integration;
        const canvasRect = event.currentTarget.getBoundingClientRect();
        const position = {
          x: event.clientX - canvasRect.left - 150, // Offset for node width
          y: event.clientY - canvasRect.top - 50, // Offset for node height
        };

        handleAddNode(integration, position);
      } catch (error) {
        console.error("Failed to add integration:", error);
      }
    },
    [handleAddNode],
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-background">
        {/* Left Sidebar - Integrations */}
        <Sidebar side="left" className="w-80 border-r">
          <SidebarContent>
            <IntegrationsPanel onAddNode={handleAddNode} />
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Input
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      className="font-semibold text-lg border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{nodes.length} steps</span>
                      <span>•</span>
                      <span>{connections.length} connections</span>
                      <span>•</span>
                      <Badge
                        variant={isPlaying ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {isPlaying ? "Running" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveWorkflow}
                  disabled={nodes.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLoadWorkflow}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={isPlaying ? "destructive" : "default"}
                  size="sm"
                  onClick={handlePlayWorkflow}
                  disabled={nodes.length === 0}
                  className={cn(
                    "transition-all duration-200",
                    isPlaying && "animate-pulse",
                  )}
                >
                  <Play
                    className={cn(
                      "w-4 h-4 mr-2 transition-transform",
                      isPlaying && "animate-spin",
                    )}
                  />
                  {isPlaying ? "Stop" : "Run Workflow"}
                </Button>
              </div>
            </div>
          </header>

          {/* Canvas Area */}
          <main className="flex-1 flex">
            <div
              className="flex-1 relative"
              onDrop={canvasDropHandler}
              onDragOver={(e) => e.preventDefault()}
            >
              <WorkflowCanvas
                nodes={nodes}
                connections={connections}
                onNodesChange={setNodes}
                onConnectionsChange={setConnections}
                onNodeSelect={setSelectedNodeId}
                selectedNodeId={selectedNodeId}
              />
            </div>

            {/* Right Sidebar - Configuration */}
            <div className="w-80 border-l bg-background">
              <StepConfigPanel
                node={selectedNode}
                onUpdateNode={handleUpdateNode}
                onDeleteNode={handleDeleteNode}
              />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
