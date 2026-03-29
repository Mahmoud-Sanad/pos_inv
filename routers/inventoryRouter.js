const express = require('express');
const {
  getAllInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} = require('../controllers/inventoryController');
const { protect, restrictToCompany } = require('../utils/middleware');

const router = express.Router();

router.use(protect, restrictToCompany);

/**
 * @swagger
 * /api/v1/inventories:
 *   get:
 *     summary: Get all inventories
 *     tags: [Inventories]
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
 *   post:
 *     summary: Create an inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - productId
 *               - warehouseId
 *             properties:
 *               quantity:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 *               companyId:
 *                 type: integer
 */
router
  .route('/')
  .get(getAllInventories)
  .post(createInventory);

/**
 * @swagger
 * /api/v1/inventories/{id}:
 *   get:
 *     summary: Get inventory by ID
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory ID
 *   patch:
 *     summary: Update inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # ...existing code...
 *   delete:
 *     summary: Delete inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory ID
 *               quantity:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 *               companyId:
 *                 type: integer
 *   delete:
 *     summary: Delete inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/:id')
  .get(getInventory)
  .patch(updateInventory)
  .delete(deleteInventory);

module.exports = router;