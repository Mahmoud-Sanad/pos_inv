const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRouter = require('./routers/userRouter');
const companyRouter = require('./routers/companyRouter');
const productRouter = require('./routers/productRouter');
const warehouseRouter = require('./routers/warehouseRouter');
const inventoryRouter = require('./routers/inventoryRouter');
const inventoryLogsRouter = require('./routers/inventoryLogsRouter');
const manfactureOrderRouter = require('./routers/manfactureOrderRouter');
const paymentsRouter = require('./routers/paymentsRouter');
const supplierRouter = require('./routers/supplierRouter');
const packageRouter = require('./routers/packageRouter');

const { globalErrorHandler } = require('./utils/error');

const app = express();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'POS Inventory API',
    version: '1.0.0',
    description: 'API for POS Inventory Management System',
  },
  servers: [
    {
      url: 'http://localhost:8090',
      description: 'Development server',
    },
     {
        url: 'https://demo.sportix.ae',
        description: 'Production server',
      }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routers/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/warehouses', warehouseRouter);
app.use('/api/v1/inventories', inventoryRouter);
app.use('/api/v1/inventory-logs', inventoryLogsRouter);
app.use('/api/v1/manufacture-orders', manfactureOrderRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/suppliers', supplierRouter);
app.use('/api/v1/packages', packageRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
