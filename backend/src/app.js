import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

/* =========================
   ROUTES
========================= */

// auth routes
app.use("/api/auth", authRoutes);

// tenant routes
app.use("/api/tenants", tenantRoutes);

// user routes
app.use("/api", userRoutes);

// project routes
app.use("/api/projects", projectRoutes);

// task routes
app.use("/api", taskRoutes);

/* =========================
   HEALTH CHECK (MANDATORY)
========================= */

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

/* ========================= */

export default app;
