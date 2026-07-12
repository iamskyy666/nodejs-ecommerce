/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *
 *   post:
 *     tags:
 *       - Products
 *     summary: Create product
 *     description: Admin only.
 *     responses:
 *       201:
 *         description: Product created.
 *
 * /products/upload-image:
 *   post:
 *     tags:
 *       - Products
 *     summary: Upload product image
 *     description: Admin only.
 *     responses:
 *       200:
 *         description: Image uploaded.
 *
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get single product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found.
 *
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update product
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated.
 *
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted.
 *
 * /products/{id}/reviews:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get reviews for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product reviews returned.
 */
