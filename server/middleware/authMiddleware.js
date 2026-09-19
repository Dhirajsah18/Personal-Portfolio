import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_portfolio_jwt_key_2026_dhiraj"
      );
      req.user = decoded;
      return next();
    } catch (error) {
      console.warn("JWT verification failed:", error.message);
      const isExpired = error.name === "TokenExpiredError";
      return res.status(401).json({
        success: false,
        message: isExpired
          ? "Session expired. Please log in again."
          : "Not authorized, token invalid",
        isExpired: true,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
      isExpired: true,
    });
  }
};
