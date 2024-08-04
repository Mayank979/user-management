const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - email
 *       - password
 *     properties:
 *       id:
 *         type: string
 *         description: Unique identifier for the user
 *       username:
 *         type: string
 *         description: Username of the user
 *       email:
 *         type: string
 *         description: Email of the user
 *       password:
 *         type: string
 *         description: Password of the user
 *
 */

const UserSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

// middleware
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

module.exports = mongoose.model("User", UserSchema);
