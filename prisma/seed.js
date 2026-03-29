const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function range(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

async function main() {
  // 1. Companies
  const companies = await Promise.all(
    range(10).map(i =>
      prisma.company.create({
        data: {
          name: `Company ${i}`,
          domain: `company${i}.com`,
          taxRate: 5 + i,
          maxUsers: 4 + i,
          config: { currency: 'USD', colors: ['#000', '#FFF'] },
        },
      })
    )
  );

  // 2. Packages
  const packages = await Promise.all(
    range(10).map(i =>
      prisma.package.create({
        data: {
          name: `Package ${i}`,
          description: { features: [`Feature ${i}`] },
          price: 10 * i + 9.99,
        },
      })
    )
  );

  // 3. Users
  const users = [];
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password', 12);

  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      users.push(
        await prisma.user.create({
          data: {
            email: `user${j}_company${i + 1}@mail.com`,
            password: hashedPassword,
            companyId: company.id,
          },
        })
      );
    }
  }

  // 4. Products
  const products = [];
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      const user = users[i * 10 + ((j - 1) % 10)];
      products.push(
        await prisma.product.create({
          data: {
            name: `Product${j}_Company${i + 1}`,
            description: `Description for Product${j} of Company${i + 1}`,
            isSellable: true,
            minStock: 5,
            companyId: company.id,
            quantityType: 'pcs',
            createdBy: user.id,
          },
        })
      );
    }
  }

  // 5. Warehouses
  const warehouses = [];
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      warehouses.push(
        await prisma.warehouse.create({
          data: {
            name: `Warehouse${j}_Company${i + 1}`,
            location: `Location ${j}`,
            isFactory: j % 2 === 0,
            companyId: company.id,
          },
        })
      );
    }
  }

  // 6. Suppliers
  const suppliers = [];
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      suppliers.push(
        await prisma.supplier.create({
          data: {
            name: `Supplier${j}_Company${i + 1}`,
            contact: `contact${j}@supplier.com`,
            debtAmount: j * 100,
            companyId: company.id,
          },
        })
      );
    }
  }

  // 7. Inventories
  const inventories = [];
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      inventories.push(
        await prisma.inventory.create({
          data: {
            quantity: 100 + j,
            productId: products[i * 10 + ((j - 1) % 10)].id,
            warehouseId: warehouses[i * 10 + ((j - 1) % 10)].id,
            companyId: company.id,
          },
        })
      );
    }
  }

  // 8. InventoryLogs
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      await prisma.inventoryLogs.create({
        data: {
          companyId: company.id,
          action_type: j % 3 === 0 ? 'MOVEMENT' : j % 2 === 0 ? 'ADD' : 'SUBTRACT',
          productId: products[i * 10 + ((j - 1) % 10)].id,
          warehouseFromId: warehouses[i * 10].id,
          warehouseToId: warehouses[i * 10 + 1].id,
          quantity: 10 * j,
        },
      });
    }
  }

  // 9. Manufacture Orders
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      await prisma.manfactureOrder.create({
        data: {
          productsFrom: [{ productId: products[i * 10].id, quantity: 5 }],
          productsTo: [{ productId: products[i * 10 + 1].id, quantity: 10 }],
          companyId: company.id,
          warehouseId: warehouses[i * 10].id,
        },
      });
    }
  }

  // 10. Payments
  for (const [i, company] of companies.entries()) {
    for (let j = 1; j <= 10; j++) {
      await prisma.payments.create({
        data: {
          amount: 1000 + j * 10,
          products: [{ productId: products[i * 10].id, quantity: 2, price: 50 }],
          supplierId: suppliers[i * 10].id,
          status: j % 2 === 0 ? 'PAID' : 'PENDING',
          companyId: company.id,
        },
      });
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
