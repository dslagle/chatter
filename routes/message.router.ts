import * as express from "express";
import * as jwt from "jsonwebtoken";

import { MessageRepository } from "../data/message/message.repository";
import { UserRepository } from "../data/user/user.repository";

import { MessageSchema, MessageType } from "../data/message/message.schema";
import { UserSchema, UserType } from "../data/user/user.schema";

const router: express.Router = express.Router();

router.get("/", function(request: express.Request, response: express.Response) {
    console.log("Finding messages...");
    MessageRepository.retrieveWithUser(function(err, messages: MessageType[]) {
        if (err) response.status(404).json({ title: "Error", error: "Who cares?" });
        else response.json(messages);
    });
});

router.use("/", function(request: express.Request, response: express.Response, next: express.NextFunction) {
    jwt.verify(request.query.token, "secret", function(err, decoded) {
        if (err) {
            return response.status(401).json({title: "Authentication Failed", message: "Unauthorized route access"});
        }

        next();
    });
});

router.post("/", function(request: express.Request, response: express.Response) {
    console.log("Attempting to save a new message: " + JSON.stringify(request.body));

    let decoded: any = jwt.decode(request.query.token);

    UserSchema.findById(decoded.user._id, function(err, userResult: UserType) {
        let m: MessageType = new MessageSchema({ user: userResult, content: request.body.content });

        MessageRepository.create(m, function(err, result) {
            userResult.messages.push(m._id);
            UserRepository.update(userResult._id, userResult, () => {});

            response.status(201).json(result);
        });
    });
});

router.patch("/:id", function(request: express.Request, response: express.Response) {
    let decoded: any = jwt.decode(request.query.token);

    MessageRepository.findById(request.params.id, function(err: any, message: MessageType) {
        if (err || !message) {
            console.log(`Error updating message: ${err}`);
            return response.status(404).json({ title: "Error", error: "Unknown error updating message." });
        }

        if (message.user !== decoded.user._id) {
            return response.status(401).json({title: "Authorization Error", error: "Message not owned by current owner."});
        }

        message.content = request.body.content;
        message.save(function(err, result) {
            if (err) {
                response.status(404).json({ title: "Error", error: "Unknown error saving a change to a message." });
                console.log(`Error updating message: ${err}`);
            }
            else {
                console.log(`Updated message ${request.params.id}`);
                response.status(200).json(result);
            }
        });
    });
});

router.delete("/:id", function(request: express.Request, response: express.Response) {
    let decoded: any = jwt.decode(request.query.token);

    MessageRepository.findById(request.params.id, function(err, message: MessageType) {
        if (err || !message) {
            console.log(`Error deleting message: ${err}`);
            return response.status(404).json({ title: "Error", error: "Unknown error deleting message." });
        }

        if (message.user !== decoded.user._id) {
            return response.status(401).json({title: "Authorization Error", error: "Message not owned by current user."});
        }

        message.remove(function(err, result) {
            if (err) {
                console.log(`Error deleting message: ${err}`);
                return response.status(404).json({ title: "Error", error: "Unknown error deleting message." });
            }
            else {
                console.log(`Deleted message ${request.params.id}`);
                return response.status(200).json(result);
            }
        });
    });
});

export { router as messageRouter };