const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllWarehouses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where: { companyId: req.companyId },
        skip,
        take: limit,
        include: {
          company: true,
          inventories: true,
          inventoryLogsFrom: true,
          inventoryLogsTo: true,
          manfactureOrders: true,
        },
      }),
      prisma.warehouse.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: warehouses.length,
      data: {
        warehouses,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      include: {
        company: true,
        inventories: true,
        inventoryLogsFrom: true,
        inventoryLogsTo: true,
        manfactureOrders: true,
      },
    });

    if (!warehouse) {
      return next(new AppError('No warehouse found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        warehouse,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await prisma.warehouse.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        warehouse,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await prisma.warehouse.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        warehouse,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteWarehouse = async (req, res, next) => {
  try {
    await prisma.warehouse.delete({
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
  getAllWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};