const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllInventories = async (req, res, next) => {
  try {
    const inventories = await prisma.inventory.findMany({
      where: { companyId: req.companyId },
    });

    res.status(200).json({
      status: 'success',
      results: inventories.length,
      data: {
        inventories,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getInventory = async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
    });

    if (!inventory) {
      return next(new AppError('No inventory found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        inventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createInventory = async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        inventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        inventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteInventory = async (req, res, next) => {
  try {
    await prisma.inventory.delete({
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
  getAllInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};