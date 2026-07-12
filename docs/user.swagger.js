/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Admin only.
 *     responses:
 *       200:
 *         description: List of users.
 *
 * /users/show-me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Show current user
 *     responses:
 *       200:
 *         description: Current user information.
 *
 * /users/update-user:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user
 *     responses:
 *       200:
 *         description: User updated successfully.
 *
 * /users/update-user-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update password
 *     responses:
 *       200:
 *         description: Password updated.
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get single user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found.
 *       404:
 *         description: User not found.
 */
