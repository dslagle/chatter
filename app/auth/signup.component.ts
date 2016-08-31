import { Component, OnInit } from "@angular/core";
import {AuthService} from "./authentication.service";
import {User} from "./user";
import {ErrorService} from "../errors/error.service";
import {Validators, FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

@Component({
    selector: 'user-signup',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form [formGroup]="_myForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input formControlName="email" type="email" id="email" class="form-control">
                </div>
                <div formGroupName="passwords">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input formControlName="password" type="password" id="password" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="confirm">Confirm Password</label> <span *ngIf="!_myForm.find('passwords').valid" class="error-message">Passwords must match!</span>
                        <input formControlName="confirm" type="password" id="confirm" class="form-control">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="!_myForm.valid">Sign Up</button>
            </form>
        </section>
    `,
    directives: [ REACTIVE_FORM_DIRECTIVES ],
    styles: [`
        .error-message {
            color: red;
        }
    `]
})
export class SignupComponent implements OnInit {
    _myForm: FormGroup;
    _emailRegex: string = "/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i";

    constructor(private _authService: AuthService, private _errorService: ErrorService) { }

    onSubmit() {
        let u: User = new User(this._myForm.value.email, false);
        u.password = this._myForm.value.passwords.password;

        console.log(u);

        this._authService.signup(u)
            .subscribe(
                data => console.log(data),
                error => this._errorService.handleError({ title: error.title, message: error.message })
            );
    }

    ngOnInit() {
        this._myForm = new FormGroup({
            email: new FormControl('', Validators.required),
            passwords: new FormGroup({
                password: new FormControl('', Validators.required),
                confirm: new FormControl('', Validators.required)
            })
        });
    }

    doPasswordsMatch(passwords: FormGroup): { [s: string]: boolean } {
        let val1: string = passwords.find('password').value;
        let val2: string = passwords.find('confirm').value;

        if (val1 !== val2) {
            return {s: false};
        }

        return null;
    }
}