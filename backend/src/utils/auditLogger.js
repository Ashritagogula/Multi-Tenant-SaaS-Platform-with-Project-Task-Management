import db from "../config/db.js";

export const logAudit = async ({
  tenant_id,
  user_id,
  action,
  entity_type,
  entity_id,
  ip_address,
}) => {
  try {
    await db.query(
      `
      INSERT INTO audit_logs
      (id, tenant_id, user_id, action, entity_type, entity_id, ip_address, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      `,
      [tenant_id, user_id, action, entity_type, entity_id, ip_address]
    );
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};
