/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import {
  Workflow,
  WorkflowResponse,
  WorkflowsResponse,
  SaveWorkflowRequest,
  WorkflowExecutionLog,
} from "./types";

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * API response types for workflow endpoints
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type {
  Workflow,
  WorkflowResponse,
  WorkflowsResponse,
  SaveWorkflowRequest,
  WorkflowExecutionLog,
};
