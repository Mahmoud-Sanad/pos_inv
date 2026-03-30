const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error')

const prisma = new PrismaClient();

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { companyId: req.companyId },
        skip,
        take: limit,
        include: {
          company: true,
          user: true,
          inventories: true,
          inventoryLogs: true,
        },
      }),
      prisma.product.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      include: {
        company: true,
        user: true,
        inventories: true,
        inventoryLogs: true,
      },
    });

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  const { name, description, price, quantityType, avgPrice,category } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantityType,
        avgPrice,
        createdBy: req.user.id,
        companyId: req.companyId,
        
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({
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
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};