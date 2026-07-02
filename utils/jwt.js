import { StatusCodes } from "http-status-codes";
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

// setup cookies (optional)
function attachCookiesToResp({ res, user }) {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
}

export { createJWT, isTokenValid, attachCookiesToResp };
