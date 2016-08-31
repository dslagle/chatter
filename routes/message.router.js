"use strict";
var express = require("express");
var jwt = require("jsonwebtoken");
var message_repository_1 = require("../data/message/message.repository");
var user_repository_1 = require("../data/user/user.repository");
var message_schema_1 = require("../data/message/message.schema");
var user_schema_1 = require("../data/user/user.schema");
var router = express.Router();
exports.messageRouter = router;
router.get("/", function (request, response) {
    console.log("Finding messages...");
    message_repository_1.MessageRepository.retrieveWithUser(function (err, messages) {
        if (err)
            response.status(404).json({ title: "Error", error: "Who cares?" });
        else
            response.json(messages);
    });
});
router.use("/", function (request, response, next) {
    jwt.verify(request.query.token, "secret", function (err, decoded) {
        if (err) {
            return response.status(401).json({ title: "Authentication Failed", message: "Unauthorized route access" });
        }
        next();
    });
});
router.post("/", function (request, response) {
    console.log("Attempting to save a new message: " + JSON.stringify(request.body));
    var decoded = jwt.decode(request.query.token);
    user_schema_1.UserSchema.findById(decoded.user._id, function (err, userResult) {
        var m = new message_schema_1.MessageSchema({ user: userResult, content: request.body.content });
        message_repository_1.MessageRepository.create(m, function (err, result) {
            userResult.messages.push(m._id);
            user_repository_1.UserRepository.update(userResult._id, userResult, function () { });
            response.status(201).json(result);
        });
    });
});
router.patch("/:id", function (request, response) {
    var decoded = jwt.decode(request.query.token);
    message_repository_1.MessageRepository.findById(request.params.id, function (err, message) {
        if (err || !message) {
            console.log("Error updating message: " + err);
            return response.status(404).json({ title: "Error", error: "Unknown error updating message." });
        }
        if (message.user !== decoded.user._id) {
            return response.status(401).json({ title: "Authorization Error", error: "Message not owned by current owner." });
        }
        message.content = request.body.content;
        message.save(function (err, result) {
            if (err) {
                response.status(404).json({ title: "Error", error: "Unknown error saving a change to a message." });
                console.log("Error updating message: " + err);
            }
            else {
                console.log("Updated message " + request.params.id);
                response.status(200).json(result);
            }
        });
    });
});
router.delete("/:id", function (request, response) {
    var decoded = jwt.decode(request.query.token);
    message_repository_1.MessageRepository.findById(request.params.id, function (err, message) {
        if (err || !message) {
            console.log("Error deleting message: " + err);
            return response.status(404).json({ title: "Error", error: "Unknown error deleting message." });
        }
        if (message.user !== decoded.user._id) {
            return response.status(401).json({ title: "Authorization Error", error: "Message not owned by current user." });
        }
        message.remove(function (err, result) {
            if (err) {
                console.log("Error deleting message: " + err);
                return response.status(404).json({ title: "Error", error: "Unknown error deleting message." });
            }
            else {
                console.log("Deleted message " + request.params.id);
                return response.status(200).json(result);
            }
        });
    });
});
