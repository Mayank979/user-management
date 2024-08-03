"use strict";
const mongoose = require("mongoose");
const debug = require("debug")("backend:src:config:db");

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI);

const connection = mongoose.connection;
connection.once("open", () => {
	debug("mongoose connection established");
});
