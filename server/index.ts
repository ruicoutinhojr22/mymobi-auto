import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
} from "./routes/workflows";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Workflow API routes
  app.get("/api/workflows", getWorkflows);
  app.get("/api/workflows/:id", getWorkflow);
  app.post("/api/workflows", createWorkflow);
  app.put("/api/workflows/:id", updateWorkflow);
  app.delete("/api/workflows/:id", deleteWorkflow);
  app.post("/api/workflows/:id/execute", executeWorkflow);

  return app;
}
