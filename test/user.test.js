const supertest = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

describe("Auth API", () => {
	beforeAll(async () => {
		await User.deleteMany();
	});

	afterAll(function (done) {
		server.close(done);
	});

	it("should register a user", async () => {
		const res = await request.post("/api/auth/register").send({
			name: "John Doe",
			email: "john@example.com",
			password: "password123",
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("token");
	});

	it("should login a user", async () => {
		const res = await request.post("/api/auth/login").send({
			email: "john@example.com",
			password: "password123",
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("token");
	});
});

let token;

let server = null;
let request = null;

beforeAll(function (done) {
	server = app.listen(done);
	request = supertest.agent(server);
});

describe("User API", () => {
	beforeAll(async () => {
		await User.deleteMany();

		const user = await User.create({
			name: "Admin User",
			email: "admin@example.com",
			password: "password123",
			role: "admin",
		});

		token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("should get user profile", async () => {
		const res = await request
			.get("/api/users/profile")
			.set("Authorization", `Bearer ${token}`);

		expect(res.statusCode).toEqual(200);
	});

	it("should update user profile", async () => {
		const res = await request
			.put("/api/users/profile")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Updated Admin",
			});

		expect(res.statusCode).toEqual(200);
	});

	it("should delete a user", async () => {
		const user = await User.create({
			name: "User to delete",
			email: "delete@example.com",
			password: "password123",
		});

		const res = await request
			.delete(`/api/users/${user._id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.statusCode).toEqual(200);
	});
});
