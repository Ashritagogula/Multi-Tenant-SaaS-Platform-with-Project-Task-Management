import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
      "http://localhost:3000", // Docker frontend
      "http://localhost:5173"  // Vite dev frontend
    ],
    credentials: true
  })
);

/* =========================
   ROUTES
========================= */

// auth routes
app.use("/api/auth", authRoutes);

// tenant routes (register, list, etc.)
app.use("/api/tenants", tenantRoutes);

// user routes
app.use("/api", userRoutes);

// project routes
app.use("/api/projects", projectRoutes);

// task routes
app.use("/api", taskRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ========================= */

export default app;
