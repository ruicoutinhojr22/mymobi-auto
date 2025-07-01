/**
 * Shared types for the no-code automation platform
 */

export type IntegrationType =
  | "gmail"
  | "slack"
  | "webhook"
  | "http"
  | "sheets"
  | "paypal"
  | "trigger";

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  description: string;
  icon: string;
  color: string;
  category: "trigger" | "action" | "logic";
  fields: IntegrationField[];
}

export interface IntegrationField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "json" | "boolean" | "number";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface WorkflowNode {
  id: string;
  type: IntegrationType;
  position: { x: number; y: number };
  data: {
    label: string;
    integration: Integration;
    config: Record<string, any>;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  status: "success" | "error" | "running";
  startTime: string;
  endTime?: string;
  error?: string;
  steps: {
    nodeId: string;
    status: "success" | "error" | "skipped";
    executionTime: number;
    output?: any;
    error?: string;
  }[];
}

// API Response types
export interface WorkflowResponse {
  workflow: Workflow;
}

export interface WorkflowsResponse {
  workflows: Workflow[];
  total: number;
}

export interface SaveWorkflowRequest {
  workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">;
}
