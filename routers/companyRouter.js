const express = require('express');
const {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect } = require('../utils/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - domain
 *             properties:
 *               name:
 *                 type: string
 *               domain:
 *                 type: string
 *               taxRate:
 *                 type: number
 *               maxUsers:
 *                 type: integer
 *               config:
 *                 type: object
 *     responses:
 *       201:
 *         description: Company created
 *       400:
 *         description: Bad request
 */
router.route('/').get(getAllCompanies).post(createCompany);

/**
 * @swagger
 * /api/v1/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company data
 *       404:
 *         description: Company not found
 *   patch:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               domain:
 *                 type: string
 *               taxRate:
 *                 type: number
 *               maxUsers:
 *                 type: integer
 *               config:
 *                 type: object
 *     responses:
 *       200:
 *         description: Company updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Company deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router
  .route('/:id')
  .get(getCompany)
  .patch(protect, updateCompany)
  .delete(protect, deleteCompany);

module.exports = router;