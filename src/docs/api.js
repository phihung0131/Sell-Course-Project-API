const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Định nghĩa cấu hình cho Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "This is the API documentation for your Express application",
    },
  },
  apis: ["./src/routes/*.js"],
};

// Tạo swagger specs
const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app, port) => {
  // Thiết lập đường dẫn để xem tài liệu Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = setupSwaggerDocs;
