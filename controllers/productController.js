const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error')

const prisma = new PrismaClient();

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {name , warehouseId , sellable} = req.query;
    const skip = (page - 1) * limit;
    let where = { companyId: req.companyId };

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (warehouseId) {
      where.inventories = {
        some: {
          warehouseId: parseInt(warehouseId),
        },
      };
    }
    
    if (sellable) {
      where.isSellable = sellable === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          inventories: true,
          inventoryLogs: true,
        },
         orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where, })
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
  const { name, description, price, quantityType, avgPrice,category ,sellable } = req.body;
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
        category,
        isSellable: sellable,
        
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