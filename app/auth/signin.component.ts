import { Component } from "@angular/core";
import {AuthService} from "./authentication.service";
import {User} from "./user";
import {Router} from "@angular/router";
import {ErrorService} from "../errors/error.service";
import {Error} from "../errors/error"

@Component({
    selector: 'user-signin',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form (ngSubmit)="onSubmit()" #myForm="ngForm">
                <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input name="email" [(ngModel)]="model.email" type="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input name="password" [(ngModel)]="model.password" type="password" class="form-control" required>
                </div>
                <button type="submit" name="submit" class="btn btn-primary" [disabled]="!myForm.form.valid">Sign In</button>
                <img src="/assets/ajax-loader-white.gif" *ngIf="processing" />
            </form>
        </section>
    `,
    styles: [`
        .error-message {
            padding: 3px;
            margin: 3px;
            border: 1px solid red;
            background-color: lightcoral;
        }
    `]
})
export class SigninComponent {
    errorMessage: string;
    processing: boolean = false;
    model: User = new User("", false);

    constructor(private _authService: AuthService, private _router: Router, private _errorService: ErrorService) { console.log('new signin component'); }

    onSubmit() {
        this.processing = true;

        console.log("submit signin: " + this.model);

        this._authService.signin(this.model)
            .subscribe(
                result => {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userId', result.uid);

                    this._authService.getFriends(result.uid, result.token);

                    this._authService.isLoggedIn = true;
                    this.processing = false;
                    this._router.navigateByUrl('/');
                },
                error => {
                    this.processing = false;
                    let e: Error = new Error(error.title, error.message);

                    this._errorService.handleError(e);
                }
            );
    }
}