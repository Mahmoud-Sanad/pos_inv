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
 *   post:
 *     summary: Create a manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
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
 *   patch:
 *     summary: Update manufacture order
 *     tags: [Manufacture Orders]
 *     security:
 *       - bearerAuth: []
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