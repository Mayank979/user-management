const createError = require("http-errors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// setup mongo
require("./config/db");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json("Home"));
app.use("/api/users", userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// sending error json
	// can be handled further depending on environment
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: req.app.get("env") === "development" ? err : {},
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
