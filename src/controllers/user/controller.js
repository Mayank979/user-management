const User = require("../../models/user");
const debug = require("debug")("backend:controllers:user");

const registerUser = async (req, res, next) => {
	debug("register user controller");
	try {
		const { name, email, password } = req.body;

		const user = new User({ name, email, password });
		debug("user data is", user);
		await user.save();
		return res.json({
			status: 200,
			body: {
				message: "user created successfully",
				data: user,
			},
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { registerUser };
