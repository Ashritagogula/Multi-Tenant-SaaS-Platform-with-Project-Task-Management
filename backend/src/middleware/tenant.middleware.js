export const tenantIsolation = (req, res, next) => {
  if (req.user.role === "super_admin") {
    return next();
  }

  if (!req.user.tenant_id) {
    return res.status(400).json({ message: "Tenant context missing" });
  }

  req.tenant_id = req.user.tenant_id;
  next();
};
