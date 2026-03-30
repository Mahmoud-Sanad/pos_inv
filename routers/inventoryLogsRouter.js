const express = require('express');
const {
  getAllInventoryLogs,
  getInventoryLog,
  createInventoryLog,
  updateInventoryLog,
  deleteInventoryLog,
} = require('../controllers/inventoryLogsController');
const { protect, restrictToCompany } = require('../utils/middleware');

const router = express.Router();

router.use(protect, restrictToCompany);

/**
 * @swagger
 * /api/v1/inventory-logs:
 *   get:
 *     summary: Get all inventory logs
 *     tags: [Inventory Logs]
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
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date (inclusive) for filtering logs (ISO8601)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date (inclusive) for filtering logs (ISO8601)
 *       - in: query
 *         name: action_type
 *         schema:
 *           type: string
 *           enum: [MOVEMENT, ADD, SUBTRACT]
 *         description: Filter by action type
 *     responses:
 *       200:
 *         description: List of inventory logs
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
 *                     inventoryLogs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           action_type:
 *                             type: string
 *                           productId:
 *                             type: integer
 *                           warehouseFromId:
 *                             type: integer
 *                           warehouseToId:
 *                             type: integer
 *                           quantity:
 *                             type: integer
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
 *     summary: Create an inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action_type
 *               - productId
 *               - quantity
 *             properties:
 *               action_type:
 *                 type: string
 *                 description: Type of inventory action
 *                 enum:
 *                   - MOVEMENT
 *                   - ADD
 *                   - SUBTRACT
 *               productId:
 *                 type: integer
 *                 description: Product ID
 *               warehouseFromId:
 *                 type: integer
 *                 description: Source warehouse ID (required for MOVEMENT)
 *               warehouseToId:
 *                 type: integer
 *                 description: Destination warehouse ID (required for MOVEMENT, ADD, SUBTRACT)
 *               quantity:
 *                 type: integer
 *                 description: Quantity to move/add/subtract
 *               reference:
 *                 type: string
 *                 description: Optional reference or note
 *     responses:
 *       201:
 *         description: Inventory log created successfully
 *       400:
 *         description: Bad request
 */
router
  .route('/')
  .get(getAllInventoryLogs)
  .post(createInventoryLog);

/**
 * @swagger
 * /api/v1/inventory-logs/{id}:
 *   get:
 *     summary: Get inventory log by ID
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory Log ID
 *   patch:
 *     summary: Update inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory Log ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # ...existing code...
 *   delete:
 *     summary: Delete inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory Log ID
 *               action_type:
 *                 type: string
 *                 enum: [MOVEMENT, ADD, SUBTRACT]
 *               productId:
 *                 type: integer
 *               warehouseFromId:
 *                 type: integer
 *               warehouseToId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               companyId:
 *                 type: integer
 *   delete:
 *     summary: Delete inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/:id')
  .get(getInventoryLog)
  .patch(updateInventoryLog)
  .delete(deleteInventoryLog);

module.exports = router;