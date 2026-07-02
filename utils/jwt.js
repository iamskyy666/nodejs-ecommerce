import jwt from "jsonwebtoken";

//  create token
function createJWT({ payload }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
}

// verify token
function isTokenValid({ token }) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { createJWT, isTokenValid };
