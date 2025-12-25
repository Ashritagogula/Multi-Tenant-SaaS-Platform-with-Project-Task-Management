import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    );

    // ✅ NORMALIZE USER DATA (VERY IMPORTANT)
    req.user = {
      userId: decoded.userId || decoded.id,
      tenantId: decoded.tenantId || decoded.tenant_id,
      role: decoded.role,
    };

    // 🔴 SAFETY CHECK (optional but recommended)
    if (!req.user.userId || !req.user.tenantId || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
