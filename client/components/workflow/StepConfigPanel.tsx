import React, { useState, useEffect } from "react";
import { WorkflowNode, IntegrationField } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MessageCircle,
  Globe,
  FileSpreadsheet,
  CreditCard,
  Webhook,
  Save,
  Trash2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepConfigPanelProps {
  node: WorkflowNode | null;
  onUpdateNode: (nodeId: string, config: Record<string, any>) => void;
  onDeleteNode: (nodeId: string) => void;
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

export default function StepConfigPanel({
  node,
  onUpdateNode,
  onDeleteNode,
}: StepConfigPanelProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (node) {
      setConfig(node.data.config);
      setHasChanges(false);
    }
  }, [node]);

  const handleFieldChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (node) {
      onUpdateNode(node.id, config);
      setHasChanges(false);
    }
  };

  const handleDelete = () => {
    if (node && confirm("Are you sure you want to delete this step?")) {
      onDeleteNode(node.id);
    }
  };

  const renderField = (field: IntegrationField) => {
    const value = config[field.key] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleFieldChange(field.key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "json":
        return (
          <Textarea
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(field.key, parsed);
              } catch {
                handleFieldChange(field.key, e.target.value);
              }
            }}
            placeholder={field.placeholder}
            required={field.required}
            rows={6}
            className="font-mono text-sm"
          />
        );

      case "boolean":
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              handleFieldChange(field.key, parseFloat(e.target.value) || 0)
            }
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  if (!node) {
    return (
      <div className="h-full flex flex-col bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">⚙️</div>
            <p className="text-sm">Select a step to configure</p>
            <p className="text-xs">
              Click on any workflow step to edit its settings
            </p>
          </div>
        </CardContent>
      </div>
    );
  }

  const IconComponent = iconMap[node.type] || Globe;

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
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
            <CardTitle className="text-lg truncate">
              {node.data.integration.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {node.data.integration.description}
            </p>
          </div>
          <Badge
            variant="secondary"
            style={{
              backgroundColor: `${node.data.integration.color}15`,
              color: node.data.integration.color,
            }}
          >
            {node.data.integration.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        <div className="space-y-4">
          {node.data.integration.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                {field.description && (
                  <div className="group relative">
                    <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {field.description}
                    </div>
                  </div>
                )}
              </div>
              {renderField(field)}
            </div>
          ))}
        </div>

        <Separator />

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Advanced Settings</h4>
          <div className="space-y-2">
            <Label htmlFor="step-name" className="text-sm">
              Step Name
            </Label>
            <Input
              id="step-name"
              value={node.data.label}
              onChange={(e) => {
                // This would need to be handled at a higher level
                // For now, just show the current label
              }}
              placeholder="Enter step name..."
            />
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <div className="p-4 border-t bg-muted/20 space-y-2">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {hasChanges ? "Save Changes" : "Saved"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="w-full"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Step
        </Button>
      </div>
    </div>
  );
}
