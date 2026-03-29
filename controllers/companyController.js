const { PrismaClient } = require('@prisma/client');;
const { AppError } = require('../utils/error');

const prisma = new PrismaClient();
const initCompany = async (company)=> {
 try {
 // create 4 users with different roles (admin , inventory_manager, CEO, finance_manager) and assign them to the company.
 // create 4 warehouses and assign them to the company.
 const domain = company.domain;
  await prisma.user.create({
   data: {
     name: 'Admin User',
     email: `admin@${domain}`,
     password: `admin@password@${domain}`,
     companyId: company.id,
     role: 'admin'
   }
 });
  await prisma.user.create({
   data: {
     name: 'Inventory Manager',
      email: `inventory_manager@${domain}`,
      password: `inventory_manager@password@${domain}`,
      companyId: company.id,
      role: 'inventory_manager'
    }
  });
   await prisma.user.create({
    data: {
      name: 'CEO',
      email: `ceo@${domain}`,
      password: `ceo@password@${domain}`,
      companyId: company.id,
      role: 'CEO'
    }
  });
   await prisma.user.create({
    data: {
      name: 'Finance Manager',
      email: `finance_manager@${domain}`,
      password: `finance_manager@password@${domain}`,
      companyId: company.id,
      role: 'finance_manager'
    }
  });
 await prisma.warehouse.create({
    data: {
      name: 'Warehouse 1',
      location: 'Location 1',
      isFactory: false,
      companyId: company.id
    }
  });
  await prisma.warehouse.create({
    data: {
      name: 'Warehouse 2',
      location: 'Location 2',
      isFactory: false,
      companyId: company.id
    }
  });
   await prisma.warehouse.create({
    data: {
      name: 'Warehouse 3',
      location: 'Location 3',
      isFactory: false,
      companyId: company.id
    }
  });
  await prisma.warehouse.create({
    data: {
      name: 'Warehouse 4',
      location: 'Location 4',
      isFactory: false,
      companyId: company.id
    }
  });

}catch (err) {
    console.log(err);
  }
} 
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
    await initCompany(company);
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