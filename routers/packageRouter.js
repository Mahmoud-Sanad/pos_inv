const express = require('express');
const {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *   post:
 *     summary: Create a package
 *     tags: [Packages]
 */
router
  .route('/')
  .get(getAllPackages)
  .post(createPackage);

/**
 * @swagger
 * /api/v1/packages/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Packages]
 *   patch:
 *     summary: Update package
 *     tags: [Packages]
 *   delete:
 *     summary: Delete package
 *     tags: [Packages]
 */
router
  .route('/:id')
  .get(getPackage)
  .patch(updatePackage)
  .delete(deletePackage);

module.exports = router;