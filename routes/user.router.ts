import * as express from "express";
import { UserSchema, UserType, IUser } from "../data/user/user.schema";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../data/user/user.repository";
import Server = SocketIO.Server;

let ObjectId = require("mongoose").Types.ObjectId;

let io: Server = null;
let router = express.Router();

router.post("/", function(request, response) {
    console.log("Attempting to save a new user: " + JSON.stringify(request.body));
    let u: UserType = new UserSchema({ email: request.body.email, password: request.body.password, loggedIn: false });

    u.save(function(err, result) {
        if (err) {
            console.log(err);
            response.status(404).json({ success: false });
        }
        else {
            response.status(200).json(result);
        }
    });
});

router.post("/signin", function(request, response) {
    setTimeout(() => {
        UserRepository.retrieveOne({email: request.body.email, password: request.body.password}, function (err: any, user: UserType) {
            if (err) {
                response.status(404).json({title: "Unknown Error", message: "Unknown error occurred during sign in."});
            }
            else if (!user) {
                response.status(404).json({title: "Authorization Error", message: "Email and password do not match."});
            }
            else {
                let token = jwt.sign({user: user}, "secret", { expiresIn: 7200 });

                user.loggedIn = true;
                user.save();

                console.log("user online: " + user);
                io.emit("online", user);

                response.status(200).json({success: true, token: token, uid: user._id});
            }
        });
    }, 1500);
});

router.get("/:id/friends", function(request, response) {
    let decoded: any = jwt.decode(request.query.token);
    console.log("get friends");
    UserRepository.retrieveColumns({ _id: { $ne: ObjectId(decoded.user._id) } }, "_id email loggedIn", function(err: any, friends: UserType[]) {
        console.log(friends);
        response.status(200).json(<IUser[]>friends);
    });
});

router.post("/signout/:id", function(request, response) {
    let decoded: any = jwt.decode(request.query.token);

    jwt.verify(request.query.token, "secret", function(err: any, decoded: any) {
        if (err) {
            return response.status(401).json({title: "Authentication Failed", message: "Unauthorized route access"});
        }
    });

    UserRepository.findById(request.params.id, function (err, result: UserType) {
        if (err) {
            response.status(404).json({title: "Unknown Error", message: "Unknown error occurred during logout."});
        }
        else if (!result) {
            response.status(404).json({title: "Authorization Error", message: "Unable to logout unknown user."});
        }
        else if (decoded.user._id !== result._id) {
            response.status(404).json({title: "Authorization Error", message: "No no. You can only logout yourself."});
        }
        else {
            let token = jwt.sign({user: result}, "secret", {expiresIn: 7200});

            console.log("user offline: " + result);
            io.emit("offline", result);

            response.status(200).json({success: true, token: token, uid: result._id});
        }
    });
});

export function createUserRouter(server: Server): express.Router {
    io = server;
    return router;
}