const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Koach API",
			version: "1.0.0",
			description: "API for user creation and authentication",
		},
		basePath: "/",
		servers: [
			{
				url: "http://localhost:3000",
			},
			{
				url: "127.0.0.1:3000",
			},
		],
		securityDefinitions: {
			Authorization: {
				type: "apiKey",
				name: "authorization",
				in: "header",
				description: "Authentication token",
			},
		},
	},
	apis: ["./src/routes/*.js", "./src/models/**/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = app => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
