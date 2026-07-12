/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     description: Admin only.
 *     responses:
 *       200:
 *         description: Orders retrieved.
 *
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create order
 *     responses:
 *       201:
 *         description: Order created.
 *
 * /orders/my-orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get current user's orders
 *     responses:
 *       200:
 *         description: User orders returned.
 *
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get single order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found.
 *
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated.
 */
