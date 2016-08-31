import { Component, Input, OnInit } from '@angular/core';
import { Message } from './message';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';

@Component({
    selector: 'message-list',
    template: `
        <div class="header-footer message">
            <message [message]="message" *ngFor="let message of _messageService.messages"></message>
        </div>
    `,
    directives: [
        MessageComponent
    ]
})
export class MessageListComponent implements OnInit {
    constructor(private _messageService: MessageService) { }

    ngOnInit() {
        this._messageService.getMessages()
            .subscribe(messages => this._messageService.messages = messages);
    }
}