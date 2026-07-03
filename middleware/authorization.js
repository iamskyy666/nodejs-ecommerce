import UnauthorizedError from "../errors/unauthorized.js";

// Best technique, because user can have more than 1 or 2 types of roles
function authorizePermissions(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("🔴 UNAUTHORIZED to access this route!");
    }
    next()
  };
}
export default authorizePermissions;
