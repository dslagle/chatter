import { DataAccess } from "../DataAccess";
import { model, Model, Schema, Document } from "mongoose";

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

export interface IMessage extends Document {
    content: string;
    user: Schema.Types.ObjectId;
}

const mSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// MessageSchema.post('remove', function(deletedMessage: any) {
//     User.findById(deletedMessage.user, function(err, u: any) {
//         u.messages.pull(deletedMessage);
//         u.save();
//     });
// });

export type MessageType = model<IMessage> & IMessage;
export const MessageSchema: Model<IMessage> = mongooseConnection.model<IMessage>("Message", mSchema);