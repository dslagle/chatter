"use strict";
var DataAccess_1 = require("../DataAccess");
var mongoose_1 = require("mongoose");
var mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
var uSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedIn: { type: Boolean, required: true },
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Message" }],
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }]
});
exports.UserSchema = mongooseConnection.model("User", uSchema);
