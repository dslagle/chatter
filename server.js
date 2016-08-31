"use strict";
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bp = require("body-parser");
var tls = require("https");
var fs = require("fs");
var io = require("socket.io");
var message_router_1 = require("./routes/message.router");
var user_router_1 = require("./routes/user.router");
var app = express();
var address = "localhost";
// const address: string = "192.168.1.14";
// const address: string = "50.167.185.158";
var port = 9000;
var options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt")
};
var server = tls.createServer(options, app);
var s = io(server);
var userRouter = user_router_1.createUserRouter(s);
mongoose.Promise = global.Promise;
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PATH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/message", message_router_1.messageRouter);
app.use("/user", userRouter);
app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
});
s.on("connect", function (socket) {
    console.log("user connected");
    socket.on("hello", function (data) {
        socket.emit("friends", {});
    });
    socket.on("message", function (msg) {
        socket.broadcast.emit("message", msg);
    });
    socket.on("signal", function (data) {
        socket.broadcast.emit("signal", data);
    });
    socket.on("disconnect", function () {
        console.log("User disconnected.");
    });
});
server.listen(port, address, function () {
    console.log("Listening on http:\\\\" + address + ":" + port);
});
