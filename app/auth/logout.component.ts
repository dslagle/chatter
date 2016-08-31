import { Component } from "@angular/core";
import {AuthService} from "./authentication.service";
import {Router} from "@angular/router";
@Component({
    selector: 'user-logout',
    template: `
        <ul class="nav navbar-nav navbar-right">
            <li *ngIf="_authService.isLoggedIn"><a href="#" (click)="logout()">Logout</a></li>
        </ul>
    `
})
export class LogoutComponent {
    constructor(private _authService: AuthService, private _router: Router) { }

    logout() {
        this._authService.logout();
        this._router.navigate(['auth']);
    }
}