import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/*
====================================
API 1: TENANT REGISTRATION
POST /api/auth/register-tenant
====================================
*/
router.post("/register-tenant", async (req, res) => {
  const {
    tenantName,
    subdomain,
    adminEmail,
    adminPassword,
    adminFullName
  } = req.body;

  if (
    !tenantName ||
    !subdomain ||
    !adminEmail ||
    !adminPassword ||
    !adminFullName
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // check tenant uniqueness
    const tenantCheck = await client.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (tenantCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Subdomain already exists"
      });
    }

    const tenantId = uuidv4();

    // insert tenant
    await client.query(
      `
      INSERT INTO tenants
      (id, name, subdomain, status, subscription_plan, max_users, max_projects)
      VALUES ($1, $2, $3, 'active', 'free', 5, 3)
      `,
      [tenantId, tenantName, subdomain]
    );

    // hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = uuidv4();

    // insert admin user (IMPORTANT: password_hash ONLY)
    await client.query(
      `
      INSERT INTO users
      (id, tenant_id, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5, 'tenant_admin')
      `,
      [userId, tenantId, adminEmail, hashedPassword, adminFullName]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully"
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("REGISTER TENANT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    client.release();
  }
});

/*
====================================
API 2: LOGIN
POST /api/auth/login
====================================
*/
router.post("/login", async (req, res) => {
  const { email, password, subdomain } = req.body;

  if (!email || !password || !subdomain) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const tenantResult = await db.query(
      "SELECT id, name, subdomain FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (tenantResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const tenant = tenantResult.rows[0];

    const userResult = await db.query(
      "SELECT * FROM users WHERE email = $1 AND tenant_id = $2",
      [email, tenant.id]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain
        }
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

/*
====================================
API 3: GET CURRENT USER
GET /api/auth/me
====================================
*/
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { userId, tenantId } = req.user;

    const userResult = await db.query(
      "SELECT id, email, full_name, role FROM users WHERE id = $1",
      [userId]
    );

    const tenantResult = await db.query(
      "SELECT id, name, subdomain FROM tenants WHERE id = $1",
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: {
        user: userResult.rows[0],
        tenant: tenantResult.rows[0]
      }
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
});

/*
====================================
API 4: LOGOUT
====================================
*/
router.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

export default router;
