import { Message } from "../message/message";

export class User {
    _id: string;
    email: string;
    password: string;
    loggedIn: boolean;
    messages: Message[];

    constructor(email: string, loggedIn: boolean, id?: string) {
        this._id = id;
        this.email = email;
        this.loggedIn = loggedIn;
    }
}