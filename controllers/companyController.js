const { PrismaClient } = require('@prisma/client');;
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany();

    res.status(200).json({
      status: 'success',
      results: companies.length,
      data: {
        companies,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        users: true,
        products: true,
        warehouses: true,
        inventories: true,
        inventoryLogs: true,
        manfactureOrders: true,
        payments: true,
        suppliers: true,
      },
    });

    if (!company) {
      return next(new AppError('No company found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.create({
      data: req.body,
    });

    res.status(201).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await prisma.company.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    await prisma.company.delete({
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
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};