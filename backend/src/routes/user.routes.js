import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import db from "../config/db.js";

const router = express.Router();

/*
====================================
API 10: Get Tenant Users
GET /api/tenants/:tenantId/users
(Only tenant_admin)
====================================
*/
router.get(
  "/tenants/:tenantId/users",
  authMiddleware,
  async (req, res) => {
    const { tenantId, role } = req.user;
    const { search = "", roleFilter = "" } = req.query;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    try {
      let query = `
        SELECT id, full_name, email, role, created_at
        FROM users
        WHERE tenant_id = $1
      `;

      const values = [tenantId];
      let index = 2;

      if (search) {
        query += ` AND (full_name ILIKE $${index} OR email ILIKE $${index})`;
        values.push(`%${search}%`);
        index++;
      }

      if (roleFilter) {
        query += ` AND role = $${index}`;
        values.push(roleFilter);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await db.query(query, values);

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("GET TENANT USERS ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

/*
====================================
API 11: Delete User
DELETE /api/users/:id
====================================
*/
router.delete(
  "/users/:id",
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { tenantId, role } = req.user;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    try {
      const result = await db.query(
        `DELETE FROM users WHERE id = $1 AND tenant_id = $2 RETURNING id`,
        [id, tenantId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  }
);

/*
====================================
API 12: Add User
POST /api/tenants/:tenantId/users
(Only tenant_admin)
====================================
*/
router.post(
  "/tenants/:tenantId/users",
  authMiddleware,
  async (req, res) => {
    const { tenantId, role } = req.user;
    const { email, fullName, password, role: userRole, active } = req.body;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!email || !fullName || !password || !userRole) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    try {
      // 🔒 check duplicate email in same tenant
      const existing = await db.query(
        `SELECT id FROM users WHERE email = $1 AND tenant_id = $2`,
        [email, tenantId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const result = await db.query(
        `INSERT INTO users (email, full_name, password, role, tenant_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name, role, created_at`,
        [email, fullName, password, userRole, tenantId]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      console.error("ADD USER ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to add user",
      });
    }
  }
);


/*
====================================
API 13: Update User
PUT /api/users/:id
(Only tenant_admin)
====================================
*/
router.put(
  "/users/:id",
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const { email, fullName, password, role: userRole, active } = req.body;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    try {
      let query = `
        UPDATE users SET
          email = $1,
          full_name = $2,
          role = $3
      `;
      const values = [email, fullName, userRole];
      let index = 4;

      // 🔐 password optional for edit
      if (password) {
        query += `, password = $${index}`;
        values.push(password);
        index++;
      }

      query += ` WHERE id = $${index} AND tenant_id = $${index + 1}
                 RETURNING id, email, full_name, role`;

      values.push(id, tenantId);

      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      console.error("UPDATE USER ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  }
);


export default router;
