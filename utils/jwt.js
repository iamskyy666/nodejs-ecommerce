import jwt from "jsonwebtoken";

// Create JWT
const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Verify JWT
const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Attach JWT as an HTTP-only cookie
const attachCookiesToResp = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  return token;
};

export { createJWT, isTokenValid, attachCookiesToResp };
