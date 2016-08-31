import { DataAccess } from "../DataAccess";
import { Schema, model, Model, Document } from "mongoose";

let mongooseConnection = DataAccess.mongooseConnection;

export interface IUser extends Document {
    email: string;
    password: string;
    messages: Schema.Types.ObjectId[];
    loggedIn: boolean;
}



const uSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedIn: { type: Boolean, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User"}]
});

// MessageSchema.post('remove', function(deletedMessage: any) {
//     User.findById(deletedMessage.user, function(err, u: any) {
//         u.messages.pull(deletedMessage);
//         u.save();
//     });
// });

export type UserType = model<IUser> & IUser;
export const UserSchema: Model<IUser> = mongooseConnection.model<IUser>("User", uSchema);