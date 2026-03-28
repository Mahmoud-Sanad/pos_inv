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
 *   post:
 *     summary: Create an inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
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
 *   patch:
 *     summary: Update inventory log
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
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