import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

// 🔹 TEMP STORAGE (IMPORTANT)
let projects = [];

/*
====================================
API 12: Create Project
POST /api/projects
====================================
*/
router.post("/", (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required",
    });
  }

  const newProject = {
    id: randomUUID(),
    name,
    description: description || "",
    status: status || "active",
    createdBy: {
      id: "user-uuid-placeholder",
      fullName: "John Doe",
    },
    taskCount: 0,
    completedTaskCount: 0,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    data: newProject,
  });
});

/*
====================================
API 13: List Projects
GET /api/projects
====================================
*/
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      projects,
      total: projects.length,
    },
  });
});

/*
====================================
API 14: Get Project Details
GET /api/projects/:projectId
====================================
*/
router.get("/:projectId", (req, res) => {
  const project = projects.find(p => p.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

/*
====================================
API 14.1: Update Project
PUT /api/projects/:projectId
====================================
*/
router.put("/:projectId", (req, res) => {
  const project = projects.find(p => p.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.status = req.body.status || project.status;

  res.status(200).json({
    success: true,
    data: project,
  });
});

/*
====================================
API 15: Delete Project
DELETE /api/projects/:projectId
====================================
*/
router.delete("/:projectId", (req, res) => {
  projects = projects.filter(p => p.id !== req.params.projectId);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

export default router;
