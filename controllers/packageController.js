const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllPackages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [packages, total] = await Promise.all([
      prisma.package.findMany({ skip, take: limit }),
      prisma.package.count()
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: packages.length,
      data: {
        packages,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPackage = async (req, res, next) => {
  try {
    const package = await prisma.package.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!package) {
      return next(new AppError('No package found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        package,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createPackage = async (req, res, next) => {
  try {
    const package = await prisma.package.create({
      data: req.body,
    });

    res.status(201).json({
      status: 'success',
      data: {
        package,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const package = await prisma.package.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        package,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    await prisma.package.delete({
      where: { id: parseInt(req.params.id) },
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
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
};