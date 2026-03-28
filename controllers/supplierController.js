const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { companyId: req.companyId },
    });

    res.status(200).json({
      status: 'success',
      results: suppliers.length,
      data: {
        suppliers,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
    });

    if (!supplier) {
      return next(new AppError('No supplier found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        supplier,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        supplier,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        supplier,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    await prisma.supplier.delete({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};