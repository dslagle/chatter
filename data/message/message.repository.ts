import { IMessage, MessageSchema, MessageType } from "./message.schema";
import { RepositoryBase } from "../repository";

class MessageRepository extends RepositoryBase<IMessage> {
    private static _instance: MessageRepository = null;

    constructor () {
        super(MessageSchema);
    }

    static Instance(): MessageRepository {
        if (MessageRepository._instance) return MessageRepository._instance;

        MessageRepository._instance = new MessageRepository();
        return MessageRepository._instance;
    }

    retrieveWithUser(callback: (err: any, messages: MessageType[]) => void) {
        this._model
            .find()
            .populate("user", "_id email loggedIn")
            .exec((error: any, messages: MessageType[]) => {
                console.log(JSON.stringify(messages));
                callback(null, messages);
            });
    }
}

Object.seal(MessageRepository);
let r = MessageRepository.Instance();

export { r as MessageRepository };