const express = require('express');
const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getStats
} = require('../controllers/supplierController');
const { protect, restrictToCompany } = require('../utils/middleware');

const router = express.Router();

router.use(protect, restrictToCompany);

/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
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
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter suppliers by name (partial match)
 *     responses:
 *       200:
 *         description: List of suppliers
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
 *                     suppliers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           contact:
 *                             type: string
 *                           debtAmount:
 *                             type: number
 *                           companyId:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           # Add more fields as needed
 *   post:
 *     summary: Create a supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               debtAmount:
 *                 type: number
 *               companyId:
 *                 type: integer
 */
router
  .route('/')
  .get(getAllSuppliers)
  .post(createSupplier);

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *   patch:
 *     summary: Update supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # ...existing code...
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               debtAmount:
 *                 type: number
 *               companyId:
 *                 type: integer
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/v1/suppliers/stats:
 *   get:
 *     summary: Get supplier statistics
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSuppliersWithDept:
 *                       type: integer
 *                       example: 15
 *                     totalDeptAmount:
 *                       type: number
 *                       format: float
 *                       example: 24500.75
 */

router.route('/stats').get(getStats);
router
  .route('/:id')
  .get(getSupplier)
  .patch(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;