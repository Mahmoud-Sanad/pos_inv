const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllManfactureOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [manfactureOrders, total] = await Promise.all([
      prisma.manfactureOrder.findMany({
        where: { companyId: req.companyId },
        skip,
        take: limit,
        include: {
          company: true,
          warehouse: true,
        },
      }),
      prisma.manfactureOrder.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: manfactureOrders.length,
      data: {
        manfactureOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getManfactureOrder = async (req, res, next) => {
  try {
    const manfactureOrder = await prisma.manfactureOrder.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      include: {
        company: true,
        warehouse: true,
      },
    });

    if (!manfactureOrder) {
      return next(new AppError('No manufacture order found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        manfactureOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createManfactureOrder = async (req, res, next) => {
  try {
    const manfactureOrder = await prisma.manfactureOrder.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        manfactureOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateManfactureOrder = async (req, res, next) => {
  try {
    const manfactureOrder = await prisma.manfactureOrder.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        manfactureOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteManfactureOrder = async (req, res, next) => {
  try {
    await prisma.manfactureOrder.delete({
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
  getAllManfactureOrders,
  getManfactureOrder,
  createManfactureOrder,
  updateManfactureOrder,
  deleteManfactureOrder,
};