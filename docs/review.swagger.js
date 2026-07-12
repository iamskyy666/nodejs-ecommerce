/**
 * @openapi
 * /reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: Reviews retrieved.
 *
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create review
 *     responses:
 *       201:
 *         description: Review created.
 *
 * /reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get single review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found.
 *
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Update review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review updated.
 *
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted.
 */
