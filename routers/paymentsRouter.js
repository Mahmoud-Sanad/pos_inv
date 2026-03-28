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