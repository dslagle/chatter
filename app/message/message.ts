import { User } from "../auth/user";

export class Message {
    content: string;
    user: User;
    messageId: string;
    time: Date;
}