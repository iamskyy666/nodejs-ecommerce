import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E-Commerce REST API",
      version: "1.0.0",
      description:
        "REST API built with Node.js, Express.js, MongoDB and Mongoose.",
      contact: {
        name: "Soumadip Banerjee",
      },
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Register, login and logout users",
      },
      {
        name: "Users",
        description: "Manage users",
      },
      {
        name: "Products",
        description: "Manage products",
      },
      {
        name: "Reviews",
        description: "Manage product reviews",
      },
      {
        name: "Orders",
        description: "Manage customer orders",
      },
    ],
  },

  apis: ["./docs/*.swagger.js"],
};

export default swaggerJsdoc(options);
