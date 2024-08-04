const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createError = require("http-errors");
const debug = require("debug")("backend:src:middlewares:auth");

const verifyToken = async (req, res, next) => {
	try {
		debug("inside verifyToken middleware");
		debug("headers are", req.headers);
		const header = req.headers.authorization || req.headers.AUTHORIZATION;

		if (!header) throw createError(400, "token not found");

		const token = header.split(" ")[1];
		debug("token is", token);

		const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

		const user = await User.findById(decoded.id).select("-password");
		if (!user) throw createError(400, "user not found");
		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
};

const checkAdmin = async (req, res, next) => {
	try {
		const { role } = req.user;

		debug("user is", req.user);

		if (role !== "admin") throw createError("admin privelege required");

		next();
	} catch (err) {
		next(err);
	}
};

module.exports = { verifyToken, checkAdmin };
