/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new account.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT cookie.
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 *
 * /auth/logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Removes authentication cookie.
 *     responses:
 *       200:
 *         description: Logout successful.
 */
