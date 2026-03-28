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
 *   post:
 *     summary: Create an inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
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
 *   patch:
 *     summary: Update inventory
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
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