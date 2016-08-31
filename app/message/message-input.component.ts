import { Component, OnInit } from '@angular/core';
import { Message } from './message';
import { MessageService } from './message.service';
import {ErrorService} from "../errors/error.service";

@Component({
    selector: 'message-input',
    template: `
        <div class="header-footer">
            <div class="form-group">
                <label for="content">Message</label>
                <input type="text" class="form-control" name="content" (keyup)="onKeyUp($event)" [(ngModel)]="content" />
            </div>
            <div>
                <button type="submit" class="btn btn-primary" id="messageButton" (click)="onSubmit()">{{message ? "Save" : "Add"}}</button>
                <button type="button" *ngIf="message" class="btn btn-danger" (click)="cancelEdit()">Cancel</button>
                <img src="/assets/ajax-loader-EEEEEE.gif" *ngIf="processing" />
            </div>
        </div>
    `,
    styleUrls: [
        'css/main.css'
    ]
})
export class MessageInputComponent implements OnInit {
    message: Message;
    content: string = "";
    processing: boolean = false;

    constructor(private _messageService: MessageService, private _errorService: ErrorService) { }

    ngOnInit() {
        this._messageService.onEditMessage.subscribe(message => this.message = message);
    }

    cancelEdit() {
        this.message = null;
    }

    onKeyUp(e: KeyboardEvent) {
        if (e.keyCode === 13)
            this.addMessage(this.content);
    }

    addMessage(value: string) {
        if (value && value != '')
        {
            this.processing = true;

            var message = new Message();
            message.content = value;
            message.time = new Date(Date.now());

            this._messageService.addMessage(message)
                .subscribe(
                    m => {
                        this._messageService.messages.push(m);
                        this.processing = false;
                    },
                    error => this._errorService.handleError({title: error.title, message: error.message})
                );
            
            this.content = "";
        }
    }

    editMessage(value: string) {
        this.message.content = value;
        this._messageService.updateMessage(this.message)
            .subscribe(
                m => console.log(m),
                error => this._errorService.handleError({title: error.title, message: error.message})
            );

        this.message = null;
    }

    onSubmit() {
        if (this.message) {
            this.editMessage(this.content);
        }
        else {
            this.addMessage(this.content);
        }
    }
}
