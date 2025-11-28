import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Documentation",
      version: "1.0.0",
      description: "API documentation for blog system with posts, categories & comments",
    },
    servers: [
      {
        url: " https://blog-ka0g.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Path to API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
