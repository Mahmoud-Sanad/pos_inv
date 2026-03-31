const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        where: { companyId: req.companyId },
        skip,
        take: limit,
        include: {
          company: true,
          supplier: true,
        },
      }),
      prisma.payments.count({ where: { companyId: req.companyId } })
    ]);

    // Populate products in payments
    const allProductIds = [];
    payments.forEach(payment => {
      if (Array.isArray(payment.products)) {
        payment.products.forEach(item => item.productId && allProductIds.push(item.productId));
      }
    });
    const uniqueProductIds = [...new Set(allProductIds)];
    const products = uniqueProductIds.length > 0 ? await prisma.product.findMany({ where: { id: { in: uniqueProductIds } } }) : [];
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));
    payments.forEach(payment => {
      if (Array.isArray(payment.products)) {
        payment.products = payment.products.map(item => ({ ...item, product: productMap[item.productId] || null }));
      }
    });

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
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
      include: {
        company: true,
        supplier: true,
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
    const {amount , supplierId, status , products,type} = req.body;
    const payment = await prisma.payments.create({
      data: {
        amount,
        supplierId,
        status,
        products: Array.isArray(products) ? products : [],
        companyId: req.companyId,
      },
    });
    
    if (supplierId){
      status === 'paid' ?
      await prisma.supplier.update({
        where: { id: supplierId, companyId: req.companyId },
        data: { debtAmount: { decrement: amount } },
      })
        :
      await prisma.supplier.update({
        where: { id: supplierId, companyId: req.companyId },
        data: { debtAmount: { increment: amount } },
      });
    }
    if (type === 'buy' && Array.isArray(products)) 
      {
        for (const item of products) {
          let warehouseId = item.warehouseId;
          let quantity = item.quantity;
          let productId = item.productId;
          
          if (!warehouseId || !quantity || !productId) {
            continue; // Skip if any required field is missing
          }

          await prisma.inventory.update({
            where:{
              companyId_productId_warehouseId:{
                companyId: req.companyId,
                productId,
                warehouseId,
              }
              },
              data: {
                quantity: { increment: quantity },
            }
          });
        }

      }

    else if (type === 'sell' && Array.isArray(products))
       {
        for (const item of products) {
          let warehouseId = item.warehouseId;
          let quantity = item.quantity;
          let productId = item.productId;
          
          if (!warehouseId || !quantity || !productId) {
            continue; // Skip if any required field is missing
          }
          
          await prisma.inventory.update({
            where:{
              companyId_productId_warehouseId:{
                companyId: req.companyId,
                productId,
                warehouseId,
              }
              },
              data: {
                quantity: { decrement: quantity },
            }
          });
        }
    }
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