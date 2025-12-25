import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";

export const registerTenant = async (req, res) => {
  try {
    const { tenantName, subdomain, email, password, fullName } = req.body;

    if (!tenantName || !subdomain || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tenantId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // create tenant
    await db.query(
      `INSERT INTO tenants (id, name, subdomain, status)
       VALUES ($1, $2, $3, 'active')`,
      [tenantId, tenantName, subdomain]
    );

    // create tenant admin user
    await db.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5, 'tenant_admin')`,
      [userId, tenantId, email, hashedPassword, fullName]
    );

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Tenant registration failed",
    });
  }
};
