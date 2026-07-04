import UnauthorizedError from "../errors/unauthorized.js";

function checkPermissions(requestUser, resourceUserId) {
  // requestUser - current user
  // resourceUserId - requested user's id
  // log if needed (to debug)
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  // If none of these conditions meet, then..
  throw new UnauthorizedError("🔴 UNAUTHORIZED to access this route!");
}

export default checkPermissions;
