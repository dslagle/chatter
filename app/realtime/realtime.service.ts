import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class RealtimeService {
    private _socket: SocketIOClient.Socket;

    connect(): void {
        this._socket = io.connect({ secure: true });
    }

    observeEvent(event: string): Observable<any> {
        return Observable.fromEvent(this._socket, event);
    }

    emitEvent(event: string, data: any): void {
        this._socket.emit(event, data);
    }

    disconnect(): void {
        this._socket.close();
    }
}