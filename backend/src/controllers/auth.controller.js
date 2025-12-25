import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const login = async (req, res) => {
  console.log("LOGIN BODY ===>", req.body);

  const { email, password, subdomain } = req.body;

  // ✅ Correct validation for LOGIN
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    // 🔹 Get user (with tenant info)
    const query = `
      SELECT 
        u.id,
        u.email,
        u.password_hash,
        u.full_name,
        u.role,
        u.status,
        t.id AS tenant_id,
        t.name AS tenant_name,
        t.subdomain
      FROM users u
      JOIN tenants t ON t.id = u.tenant_id
      WHERE u.email = $1
      ${subdomain ? "AND t.subdomain = $2" : ""}
    `;

    const values = subdomain ? [email, subdomain] : [email];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = result.rows[0];

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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
          id: user.tenant_id,
          name: user.tenant_name,
          subdomain: user.subdomain
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
