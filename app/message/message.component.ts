import { Component, Input } from '@angular/core';
import { Message } from './message';
import { MessageService } from './message.service';
import {ErrorService} from "../errors/error.service";

@Component({
    selector: 'message',
    template: `
        <div style="margin: 0; padding: 0">
            <span style="font-weight: bold; color: gray">{{message.user.email}}:</span>
            <span>{{message.content}}</span>
        </div>
    `,
    styleUrls: [
        'css/main.css'
    ]
})
export class MessageComponent {
    @Input() message: Message;

    constructor(private _messageService: MessageService, private _errorService: ErrorService) { }
    
    deleteMessage(m: Message) {
        this._messageService.deleteMessage(m)
            .subscribe(
                data => console.log(data),
                error => this._errorService.handleError({title: error.title, message: error.message})
            );
    }

    editMessage(m: Message) {
        this._messageService.editMessage(m);
    }

    isMessageOwned() {
        return localStorage.getItem('userId') == this.message.user._id;
    }
}
