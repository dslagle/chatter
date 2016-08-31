import * as io from 'socket.io';
import { Server as tlsServer } from "https";

export class IOManager {
    private _server: SocketIO.Server;

    constructor(private _server: tlsServer) {
        this._server = io(_server);
    }
}

export function e(server: tlsServer): SocketIO.Server {
    return io(server);
}