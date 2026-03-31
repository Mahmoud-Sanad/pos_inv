const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllSuppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { name } = req.query;

    const where = {
      companyId: req.companyId,
    };

    if (name) {
      where.name = {
        contains: name,
      };
    }
    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          payments: true,
        },
      }),
      prisma.supplier.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: suppliers.length,
      data: {
        suppliers,
      },
    });
  } catch (err) {
    next(err);
  }
};
const getStats = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: {
        companyId: req.companyId,
      },
    });
    const totalDept = suppliers.reduce((acc, supplier) => acc + supplier.debtAmount, 0);
    const totalSuppliersWithDept = suppliers.filter(supplier => supplier.debtAmount > 0).length;
    

    res.status(200).json({
      status: 'success',
      data: {
        totalDept,
        totalSuppliersWithDept,
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
      include: {
        company: true,
        payments: true,
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
  getStats,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};