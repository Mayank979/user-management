const User = require("../../models/user");
const debug = require("debug")("backend:controllers:user");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const getUserProfile = async (req, res, next) => {
	debug("user profile controller");
	try {
		const user = await User.findById(req.user.id).select({
			name: 1,
			email: 1,
			role: 1,
		});

		if (!user) throw createError(400, "User not found");

		return res.status(200).json({ message: "User data", data: user });
	} catch (err) {
		next(err);
	}
};

const updateUserProfile = async (req, res, next) => {
	debug("inside update user profile");
	try {
		let user = await User.findById(req.user.id);

		user.name = req.body.name || req.user.name;
		user.email = req.body.email || req.user.email;

		if (req.body.password) {
			user.password = await bcrypt.hash(req.body.password, 10);
		}

		const updatedUser = await user.save();

		return res.status(200).json({
			_id: updatedUser.id,
			name: updatedUser.name,
			email: updatedUser.email,
			role: updatedUser.role,
		});
	} catch (err) {
		next(err);
	}
};

const deleteUserProfile = async (req, res, next) => {
	try {
		const { id } = req.params;

		const user = await User.findByIdAndDelete(id);

		if (!user) throw createError(400, "user not found");

		res.status(200).json({ message: "user deleted successfully" });
	} catch (err) {
		next(err);
	}
};

module.exports = { getUserProfile, updateUserProfile, deleteUserProfile };
