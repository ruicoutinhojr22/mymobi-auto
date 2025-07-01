import { RequestHandler } from "express";
import { ApiResponse, Workflow, WorkflowsResponse } from "@shared/api";

// In-memory storage for demo purposes
// In a real app, this would be a database
const workflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Email to Slack Notification",
    description: "Forward important emails to Slack channel",
    nodes: [],
    connections: [],
    createdAt: new Date("2024-12-01").toISOString(),
    updatedAt: new Date("2024-12-01").toISOString(),
    isActive: true,
  },
  {
    id: "workflow-2",
    name: "Lead Processing Pipeline",
    description: "Process new leads from website form",
    nodes: [],
    connections: [],
    createdAt: new Date("2024-11-28").toISOString(),
    updatedAt: new Date("2024-11-28").toISOString(),
    isActive: false,
  },
];

/**
 * GET /api/workflows - Get all workflows
 */
export const getWorkflows: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<WorkflowsResponse> = {
      success: true,
      data: {
        workflows,
        total: workflows.length,
      },
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch workflows",
    });
  }
};

/**
 * GET /api/workflows/:id - Get a specific workflow
 */
export const getWorkflow: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const workflow = workflows.find((w) => w.id === id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found",
      });
    }

    const response: ApiResponse<{ workflow: Workflow }> = {
      success: true,
      data: { workflow },
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch workflow",
    });
  }
};

/**
 * POST /api/workflows - Create a new workflow
 */
export const createWorkflow: RequestHandler = (req, res) => {
  try {
    const { name, description, nodes = [], connections = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Workflow name is required",
      });
    }

    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      nodes,
      connections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
    };

    workflows.push(newWorkflow);

    const response: ApiResponse<{ workflow: Workflow }> = {
      success: true,
      data: { workflow: newWorkflow },
      message: "Workflow created successfully",
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create workflow",
    });
  }
};

/**
 * PUT /api/workflows/:id - Update a workflow
 */
export const updateWorkflow: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, nodes, connections, isActive } = req.body;

    const workflowIndex = workflows.findIndex((w) => w.id === id);
    if (workflowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found",
      });
    }

    const existingWorkflow = workflows[workflowIndex];
    const updatedWorkflow: Workflow = {
      ...existingWorkflow,
      name: name ?? existingWorkflow.name,
      description: description ?? existingWorkflow.description,
      nodes: nodes ?? existingWorkflow.nodes,
      connections: connections ?? existingWorkflow.connections,
      isActive: isActive ?? existingWorkflow.isActive,
      updatedAt: new Date().toISOString(),
    };

    workflows[workflowIndex] = updatedWorkflow;

    const response: ApiResponse<{ workflow: Workflow }> = {
      success: true,
      data: { workflow: updatedWorkflow },
      message: "Workflow updated successfully",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update workflow",
    });
  }
};

/**
 * DELETE /api/workflows/:id - Delete a workflow
 */
export const deleteWorkflow: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const workflowIndex = workflows.findIndex((w) => w.id === id);

    if (workflowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found",
      });
    }

    workflows.splice(workflowIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: "Workflow deleted successfully",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete workflow",
    });
  }
};

/**
 * POST /api/workflows/:id/execute - Execute a workflow
 */
export const executeWorkflow: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const workflow = workflows.find((w) => w.id === id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: "Workflow not found",
      });
    }

    // In a real implementation, this would trigger actual workflow execution
    // For demo purposes, we'll just simulate success
    const response: ApiResponse<{ executionId: string }> = {
      success: true,
      data: { executionId: `exec-${Date.now()}` },
      message: "Workflow execution started",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to execute workflow",
    });
  }
};
