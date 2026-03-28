const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await prisma.payments.findMany({
      where: { companyId: req.companyId },
    });

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: {
        payments,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await prisma.payments.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
    });

    if (!payment) {
      return next(new AppError('No payment found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const payment = await prisma.payments.create({
      data: {
        ...req.body,
        companyId: req.companyId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const payment = await prisma.payments.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    await prisma.payments.delete({
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
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
};