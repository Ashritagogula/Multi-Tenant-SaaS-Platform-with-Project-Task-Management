import db from "../config/db.js";

/*
====================================
GET /api/tenants/:tenantId/users
====================================
*/
export const getTenantUsers = async (req, res) => {
  const { tenantId } = req.params;
  const { userId, role } = req.user;
  const { search = "", roleFilter = "" } = req.query;

  // 🔒 Only tenant_admin
  if (role !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    let query = `
      SELECT id, full_name, email, role, status, created_at
      FROM users
      WHERE tenant_id = $1
    `;
    const values = [tenantId];
    let idx = 2;

    if (search) {
      query += ` AND (full_name ILIKE $${idx} OR email ILIKE $${idx})`;
      values.push(`%${search}%`);
      idx++;
    }

    if (roleFilter) {
      query += ` AND role = $${idx}`;
      values.push(roleFilter);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/*
====================================
DELETE /api/users/:id
====================================
*/
export const deleteUser = async (req, res) => {
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
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
