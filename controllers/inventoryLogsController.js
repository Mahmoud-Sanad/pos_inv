const { PrismaClient } =  require('@prisma/client');
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();

const getAllInventoryLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const {dateFrom, dateTo,action_type} = req.query;
    let where = { companyId: req.companyId };
    if (action_type) {
      where.action_type = action_type;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      };
    }
    const [inventoryLogs, total] = await Promise.all([
      prisma.inventoryLogs.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
          product: true,
          warehouseFrom: true,
          warehouseTo: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryLogs.count({ where: { companyId: req.companyId } })
    ]);

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      results: inventoryLogs.length,
      data: {
        inventoryLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getInventoryLog = async (req, res, next) => {
  try {
    const inventoryLog = await prisma.inventoryLogs.findFirst({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      include: {
        company: true,
        product: true,
        warehouseFrom: true,
        warehouseTo: true,
      },
    });

    if (!inventoryLog) {
      return next(new AppError('No inventory log found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createInventoryLog = async (req, res, next) => {
  const { productId, warehouseFromId, warehouseToId, quantity, reference, action_type } = req.body;
  const companyId = req.companyId;

  try {
    const inventoryLog = await prisma.$transaction(async (tx) => {
      // 1) Handle actionType ADD or SUBTRACT for warehouseTo
      if (action_type === 'ADD' || action_type === 'SUBTRACT') {
        // Add stock to warehouseTo
        if (warehouseToId) {
          const warehouseToInventory = await tx.inventory.findUnique({
            where: {
              companyId_productId_warehouseId: {
                companyId,
                productId,
                warehouseId: warehouseToId,
              },
            },
          });

          if (action_type === 'ADD') {
            // Add quantity to warehouseTo
            await tx.inventory.upsert({
              where: {
                companyId_productId_warehouseId: {
                  companyId,
                  productId,
                  warehouseId: warehouseToId,
                },
              },
              update: {
                quantity: {
                  increment: quantity,
                },
              },
              create: {
                companyId,
                productId,
                warehouseId: warehouseToId,
                quantity,
              },
            });
          }

          if (action_type === 'SUBTRACT') {
            if (!warehouseToInventory || warehouseToInventory.quantity < quantity) {
              return next(new AppError("Not enough stock in target warehouse to subtract", 400));
            }

            // Subtract quantity from warehouseTo
            await tx.inventory.update({
              where: {
                companyId_productId_warehouseId: {
                  companyId,
                  productId,
                  warehouseId: warehouseToId,
                },
              },
              data: {
                quantity: {
                  decrement: quantity,
                },
              },
            });
          }
        }
      }

      // 2) Handle actionType MOVEMENT (transfer between warehouses)
      if (action_type === 'MOVEMENT') {
        // Handle outgoing stock from warehouseFrom
        if (warehouseFromId) {
          const fromInventory = await tx.inventory.findUnique({
            where: {
              companyId_productId_warehouseId: {
                companyId,
                productId,
                warehouseId: warehouseFromId,
              },
            },
          });

          if (!fromInventory || fromInventory.quantity < quantity) {
            return next(new AppError("Not enough stock in source warehouse to move", 400));
          }

          await tx.inventory.update({
            where: {
              companyId_productId_warehouseId: {
                companyId,
                productId,
                warehouseId: warehouseFromId,
              },
            },
            data: {
              quantity: {
                decrement: quantity,
              },
            },
          });
        }

        // Handle incoming stock to warehouseTo
        if (warehouseToId) {
          await tx.inventory.upsert({
            where: {
              companyId_productId_warehouseId: {
                companyId,
                productId,
                warehouseId: warehouseToId,
              },
            },
            update: {
              quantity: {
                increment: quantity,
              },
            },
            create: {
              companyId,
              productId,
              warehouseId: warehouseToId,
              quantity,
            },
          });
        }
      }

      // 3) Create the inventory log after the operations are done
      return tx.inventoryLogs.create({
        data: {
          productId,
          warehouseFromId,
          warehouseToId,
          quantity,
          reference,
          action_type,
          companyId,
        },
      });
    });

    res.status(201).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateInventoryLog = async (req, res, next) => {
  try {
    const inventoryLog = await prisma.inventoryLogs.update({
      where: {
        id: parseInt(req.params.id),
        companyId: req.companyId,
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: {
        inventoryLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteInventoryLog = async (req, res, next) => {
  try {
    await prisma.inventoryLogs.delete({
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
  getAllInventoryLogs,
  getInventoryLog,
  createInventoryLog,
  updateInventoryLog,
  deleteInventoryLog,
};