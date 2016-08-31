import { Component, Input } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SignupComponent} from "./signup.component";
import {SigninComponent} from "./signin.component";
import {AuthService} from "./authentication.service";

@Component({
    selector: 'auth',
    template: `
        <div class="row spacing" style="margin-top: 5px;">
            <div class="col-md-6">
                <user-signin></user-signin>
            </div>
            <div class="col-md-6">
                <user-signup></user-signup>
            </div>
        </div>
    `,
    directives: [ ROUTER_DIRECTIVES, SigninComponent, SignupComponent ]
})
export class AuthenticationComponent {
    constructor(private _authService: AuthService) { }
}