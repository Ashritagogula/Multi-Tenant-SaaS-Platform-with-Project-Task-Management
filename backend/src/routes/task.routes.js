import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { randomUUID } from "crypto";

const router = express.Router();

// ✅ TEMP IN-MEMORY STORAGE (SAFE FOR NOW)
let tasks = [];

/*
====================================
GET /api/projects/:projectId/tasks
====================================
*/
router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  (req, res) => {
    const projectTasks = tasks.filter(
      (t) => t.projectId === req.params.projectId
    );

    res.status(200).json({
      success: true,
      data: projectTasks,
    });
  }
);

/*
====================================
POST /api/projects/:projectId/tasks
====================================
*/
router.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  (req, res) => {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const newTask = {
      id: randomUUID(),
      projectId: req.params.projectId,
      title,
      description: description || null,
      status: "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
    });
  }
);

/*
====================================
PUT /api/tasks/:taskId
====================================
*/
router.put(
  "/tasks/:taskId",
  authMiddleware,
  (req, res) => {
    const task = tasks.find((t) => t.id === req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { title, description, status, priority, assignedTo, dueDate } =
      req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.assignedTo = assignedTo ?? task.assignedTo;
    task.dueDate = dueDate ?? task.dueDate;

    res.status(200).json({
      success: true,
      data: task,
    });
  }
);

/*
====================================
PATCH /api/tasks/:taskId/status
====================================
*/
router.patch(
  "/tasks/:taskId/status",
  authMiddleware,
  (req, res) => {
    const task = tasks.find((t) => t.id === req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = req.body.status;

    res.status(200).json({
      success: true,
      data: task,
    });
  }
);

/*
====================================
DELETE /api/tasks/:taskId
====================================
*/
router.delete(
  "/tasks/:taskId",
  authMiddleware,
  (req, res) => {
    tasks = tasks.filter((t) => t.id !== req.params.taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  }
);

export default router;
