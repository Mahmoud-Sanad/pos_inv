const express = require('express');
const {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentsController');
const { protect, restrictToCompany } = require('../utils/middleware');

const router = express.Router();

router.use(protect, restrictToCompany);

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - status
 *               - companyId
 *             properties:
 *               amount:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               supplierId:
 *                 type: integer
 *               status:
 *                 type: string
 *               companyId:
 *                 type: integer
 */
router
  .route('/')
  .get(getAllPayments)
  .post(createPayment);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Update payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               supplierId:
 *                 type: integer
 *               status:
 *                 type: string
 *               companyId:
 *                 type: integer
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router
  .route('/:id')
  .get(getPayment)
  .patch(updatePayment)
  .delete(deletePayment);

module.exports = router;