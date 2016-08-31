import { Component } from '@angular/core';
import { MessageListComponent } from '../message/message-list.component';
import { MessageInputComponent } from '../message/message-input.component';
import {ComComponent} from "../com/com.component";
import {AuthService} from "../auth/authentication.service";
import {RealtimeService} from "../realtime/realtime.service";

@Component({
    selector: 'messages',
    template: `
        <div class="col-md-8">
            <h4 class="header-footer header-radius">Message Service</h4>
            
            <message-input></message-input>
            <message-list></message-list>
            
            <h4 class="header-footer footer-radius">Cool</h4>
        </div>
        
        <div class="col-md-4">
            <my-com></my-com>
        </div>
    `,
    directives: [ MessageListComponent, MessageInputComponent, ComComponent ],
    styleUrls: [
        'css/main.css'
    ]
})
export class MessagesComponent {
    constructor(private _realtime: RealtimeService, private _authService: AuthService) {
        _realtime.connect();
    }
}