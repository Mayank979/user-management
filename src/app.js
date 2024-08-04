const createError = require("http-errors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// setup mongo
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const setupSwagger = require("../swagger-conf");

const app = express();

// Swagger setup
setupSwagger(app);

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json("Home"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
// Main error handler for express app. All errors passed to next() are caught here.
app.use((err, req, res, next) => {
	const { message, stack } = err;
	let status = res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;
	status = message == "jwt expired" ? 401 : status;
	res.status(status).json({
		message,
		status,
		stack,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
