const User = require("../../models/user");
const debug = require("debug")("backend:controllers:user");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const generateToken = id => {
	console.log("id is", id);
	return jwt.sign({ id }, process.env.PRIVATE_KEY);
};

const registerUser = async (req, res, next) => {
	debug("register user controller");
	try {
		const { name, email, password, role } = req.body;

		const userExists = await User.findOne({ email });

		if (userExists) throw createError(400, "user already exists");

		const user = await User.create({ name, email, password, role });

		if (!user) throw createError(400, "something went wrong");

		debug("user is", user);

		return res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		});
	} catch (err) {
		next(err);
	}
};

const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) throw createError(404, "User does not exists");

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) throw createError(400, "Password do not match");

		return res.status(201).json({
			token: generateToken(user._id),
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { registerUser, loginUser };
