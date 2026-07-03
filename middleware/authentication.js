import UnauthenticatedError from "../errors/unauthenticated.js";
import { isTokenValid } from "../utils/jwt.js";

async function authenticateUser(req, res, next) {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("🔴 Authentication Invalid!");
  }

  // But, if the token is present..
  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("🔴 Authentication Invalid!");
  }
}

export default authenticateUser;
