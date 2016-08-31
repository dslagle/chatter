"use strict";
var DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1.DataAccess.mongooseInstance;
var mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
var mSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
exports.MessageSchema = mongooseConnection.model("Message", mSchema);
