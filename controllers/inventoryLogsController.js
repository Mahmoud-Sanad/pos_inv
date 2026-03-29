const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllInventoryLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [inventoryLogs, total] = await Promise.all([
      prisma.inventoryLogs.findMany({
        where: { companyId: req.companyId },
        skip,
        take: limit,
        include: {
          company: true,
          product: true,
          warehouseFrom: true,
          warehouseTo: true,
        },
      }),
      prisma.inventoryLogs.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: inventoryLogs.length,
      data: {
        inventoryLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getInventoryLog = async (req, res, next) => {
  try {
    const inventoryLog = await prisma.inventoryLogs.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      include: {
        company: true,
        product: true,
        warehouseFrom: true,
        warehouseTo: true,
      },
    });

    if (!inventoryLog) {
      return next(new AppError('No inventory log found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createInventoryLog = async (req, res, next) => {
  try {
    const inventoryLog = await prisma.inventoryLogs.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateInventoryLog = async (req, res, next) => {
  try {
    const inventoryLog = await prisma.inventoryLogs.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteInventoryLog = async (req, res, next) => {
  try {
    await prisma.inventoryLogs.delete({
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
  getAllInventoryLogs,
  getInventoryLog,
  createInventoryLog,
  updateInventoryLog,
  deleteInventoryLog,
};