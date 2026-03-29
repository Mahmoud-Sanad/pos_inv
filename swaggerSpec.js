const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POS Inventory API',
      version: '1.0.0',
      description: 'API documentation for POS Inventory system',
    },
    servers: [
      {
        url: 'http://localhost:8090',
      },
      {
        url: 'https://demo.sportix.ae',
      }
    ],
  },
  apis: ['./routers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
