const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

// middleware
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

UserSchema.methods.comparePassword = async password => {
	return bcrypt.compare(this.password, password);
};

module.exports = mongoose.model("User", UserSchema);
