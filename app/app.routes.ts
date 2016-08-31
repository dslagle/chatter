import { provideRouter, RouterConfig } from '@angular/router';
import {LogoutComponent} from "./auth/logout.component";
import {AuthenticationComponent} from "./auth/authentication.component";
import {MessagesComponent} from "./message/messages.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: RouterConfig = [
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'messages' },
    { path: 'auth', component: AuthenticationComponent }
];

export const appRouterProviders = [
    provideRouter(routes),
    AuthGuard
];