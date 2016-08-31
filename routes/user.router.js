"use strict";
var express = require("express");
var user_schema_1 = require("../data/user/user.schema");
var jwt = require("jsonwebtoken");
var user_repository_1 = require("../data/user/user.repository");
var ObjectId = require("mongoose").Types.ObjectId;
var io = null;
var router = express.Router();
router.post("/", function (request, response) {
    console.log("Attempting to save a new user: " + JSON.stringify(request.body));
    var u = new user_schema_1.UserSchema({ email: request.body.email, password: request.body.password, loggedIn: false });
    u.save(function (err, result) {
        if (err) {
            console.log(err);
            response.status(404).json({ success: false });
        }
        else {
            response.status(200).json(result);
        }
    });
});
router.post("/signin", function (request, response) {
    setTimeout(function () {
        user_repository_1.UserRepository.retrieveOne({ email: request.body.email, password: request.body.password }, function (err, user) {
            if (err) {
                response.status(404).json({ title: "Unknown Error", message: "Unknown error occurred during sign in." });
            }
            else if (!user) {
                response.status(404).json({ title: "Authorization Error", message: "Email and password do not match." });
            }
            else {
                var token = jwt.sign({ user: user }, "secret", { expiresIn: 7200 });
                user.loggedIn = true;
                user.save();
                console.log("user online: " + user);
                io.emit("online", user);
                response.status(200).json({ success: true, token: token, uid: user._id });
            }
        });
    }, 1500);
});
router.get("/:id/friends", function (request, response) {
    var decoded = jwt.decode(request.query.token);
    console.log("get friends");
    user_repository_1.UserRepository.retrieveColumns({ _id: { $ne: ObjectId(decoded.user._id) } }, "_id email loggedIn", function (err, friends) {
        console.log(friends);
        response.status(200).json(friends);
    });
});
router.post("/signout/:id", function (request, response) {
    var decoded = jwt.decode(request.query.token);
    jwt.verify(request.query.token, "secret", function (err, decoded) {
        if (err) {
            return response.status(401).json({ title: "Authentication Failed", message: "Unauthorized route access" });
        }
    });
    user_repository_1.UserRepository.findById(request.params.id, function (err, result) {
        if (err) {
            response.status(404).json({ title: "Unknown Error", message: "Unknown error occurred during logout." });
        }
        else if (!result) {
            response.status(404).json({ title: "Authorization Error", message: "Unable to logout unknown user." });
        }
        else if (decoded.user._id !== result._id) {
            response.status(404).json({ title: "Authorization Error", message: "No no. You can only logout yourself." });
        }
        else {
            var token = jwt.sign({ user: result }, "secret", { expiresIn: 7200 });
            console.log("user offline: " + result);
            io.emit("offline", result);
            response.status(200).json({ success: true, token: token, uid: result._id });
        }
    });
});
function createUserRouter(server) {
    io = server;
    return router;
}
exports.createUserRouter = createUserRouter;
