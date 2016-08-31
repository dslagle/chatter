import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Message } from './message';
import 'rxjs/rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
    messages: Message[];
    @Output() onEditMessage: EventEmitter<Message> = new EventEmitter<Message>();
    @Output() onNewMessage: EventEmitter<Message> = new EventEmitter<Message>();

    constructor(private _http: Http) { }

    addMessage(m: Message): Observable<Message> {
        const t: any = localStorage.getItem('token');
        const token: string = t ? `?token=${t}` : '';

        let headers: Headers = new Headers();
        headers.append('content-type', 'application/json');
        
        return this._http.post(`/message${token}`, JSON.stringify(m), { headers: headers })
            .map(response => {
                let data = response.json();
                let message: Message = { content: data.content, user: data.user, time: new Date(data.createdAt), messageId: data._id };

                //this.onNewMessage.emit(message);

                return message;
            })
            .catch(error =>
                Observable.throw(error.json())
            );
    }

    updateMessage(m: Message): Observable<Message> {
        const t: any = localStorage.getItem('token');
        const token: string = t ? `?token=${t}` : '';

        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.patch(`/message/${m.messageId}${token}`, JSON.stringify(m), { headers: headers })
            .map(response => {
                var data = response.json();
                return { content: data.content, user: data.user, time: new Date(data.createdAt), messageId: data._id };
            })
            .catch(error => Observable.throw(error.json()));
    }

    deleteMessage(m: Message): Observable<Message> {
        const t: any = localStorage.getItem('token');
        const token: string = t ? `?token=${t}` : '';

        this.messages.splice(this.messages.indexOf(m), 1);
        console.log(`Delete message: ${m.messageId}`);
        
        return this._http.delete(`/message/${m.messageId}${token}`)
            .map(response => {
                var data = response.json();
                return { content: data.content, user: data.user, time: new Date(data.createdAt), messageId: data._id };
            })
            .catch(error => Observable.throw(error.json()));
    }

    getMessages(): Observable<Message[]> {
        return this._http.get('/message')
            .do(response => console.log(JSON.stringify(response.json())))
            .map((response: Response) => {
                var objs = response.json();
                var ms: Message[] = [];
                for (let i = 0; i < objs.length; i++) {
                    ms.push({ content: objs[i].content, user: objs[i].user, time: new Date(objs[i].createdAt), messageId: objs[i]._id });
                }

                return ms;
            })
            .catch(error => Observable.throw(error.json()));
    }

    editMessage(m: Message): void {
        this.onEditMessage.emit(m);
    }
}