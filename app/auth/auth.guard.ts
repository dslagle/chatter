import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from "./authentication.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._authService.isLoggedIn) { console.log("logged in"); return true; }

        console.log("not logged in");
        // Store the attempted URL for redirecting
        //this._authService.redirectUrl = state.url;

        // Navigate to the login page
        this._router.navigate(['auth']);

        return false;
    }
}