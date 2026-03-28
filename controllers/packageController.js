const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllPackages = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany();

    res.status(200).json({
      status: 'success',
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