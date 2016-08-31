import * as express from "express";
import * as path from "path";
import * as mongoose from "mongoose";
import * as bp from "body-parser";
import * as tls from "https";
import * as fs from "fs";
import * as io from "socket.io";

import { messageRouter } from "./routes/message.router";
import { createUserRouter } from "./routes/user.router";

let app = express();

const address: string = "localhost";
// const address: string = "192.168.1.14";
// const address: string = "50.167.185.158";
const port: number = 9000;

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt")
};

let server = tls.createServer(options, app);
let s = io(server);

let userRouter = createUserRouter(s);

mongoose.Promise = global.Promise;

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PATH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/message", messageRouter);
app.use("/user", userRouter);

app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
});

s.on("connect", function(socket) {
    console.log("user connected");

    socket.on("hello", function(data) {
        socket.emit("friends", {});
    });

    socket.on("message", function(msg) {
        socket.broadcast.emit("message", msg);
    });

    socket.on("signal", function(data) {
        socket.broadcast.emit("signal", data);
    });

    socket.on("disconnect", function() {
        console.log("User disconnected.");
    });
});

server.listen(port, address, function() {
    console.log(`Listening on http:\\\\${address}:${port}`);
});