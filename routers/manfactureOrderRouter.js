const express = require('express');
const {
  getAllManfactureOrders,
  getManfactureOrder,
  createManfactureOrder,
  updateManfactureOrder,
  deleteManfactureOrder,
} = require('../controllers/manfactureOrderController');
const { protect, restrictToCompany } = require('../utils/middleware');

const router = express.Router();

router.use(protect, restrictToCompany);

/**
 * @swagger
 * /api/v1/manufacture-orders:
 *   get:
 *     summary: Get all manufacture orders
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of manufacture orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     manfactureOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           productsFrom:
 *                             type: object
 *                           productsTo:
 *                             type: object
 *                           companyId:
 *                             type: integer
 *                           warehouseId:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           # Add more fields as needed
 *   post:
 *     summary: Create a manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productsFrom
 *               - productsTo
 *               - companyId
 *             properties:
 *               productsFrom:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               productsTo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               companyId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 */
router
  .route('/')
  .get(getAllManfactureOrders)
  .post(createManfactureOrder);

/**
 * @swagger
 * /api/v1/manufacture-orders/{id}:
 *   get:
 *     summary: Get manufacture order by ID
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Manufacture Order ID
 *   patch:
 *     summary: Update manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Manufacture Order ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # ...existing code...
 *   delete:
 *     summary: Delete manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Manufacture Order ID
 *               productsFrom:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               productsTo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               companyId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 *   delete:
 *     summary: Delete manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/:id')
  .get(getManfactureOrder)
  .patch(updateManfactureOrder)
  .delete(deleteManfactureOrder);

module.exports = router;