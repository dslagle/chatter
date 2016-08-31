import {Component, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HeaderComponent } from './header.component';
import {ErrorComponent} from "./errors/error.component";
import {RealtimeService} from "./realtime/realtime.service";
import {ComComponent} from "./com/com.component";
import {AuthService} from "./auth/authentication.service";
import {LogoutComponent} from "./auth/logout.component";
import {User} from "./auth/user";

@Component({
    selector: 'app-main',
    template: `
        <div class="col-md-12" style="padding-top: 10px;">
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="#">Vox</a>
                    </div>
                    <ul class="nav navbar-nav">
                        <li *ngFor="let user of _authService.users"><a>{{user.email}}</a></li>
                    </ul>
                    
                    <user-logout></user-logout>
                </div>
            </nav>
            <router-outlet></router-outlet>
        </div>
        <my-error></my-error>
    `,
    directives: [ HeaderComponent, ROUTER_DIRECTIVES, ErrorComponent, ComComponent, LogoutComponent ],
    styleUrls: [
        'css/main.css'
    ],
    styles: [`
        li.online {
            color: green;
        }
        
        li.offline {
            color: blue;
        }
    `]
})
export class AppComponent {
    constructor(private _authService: AuthService) { }

    private userClass(user: User): string {
        if (user.loggedIn) return "online";
        else return "offline";
    }
}