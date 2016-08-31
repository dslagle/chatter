import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { User } from "./user";
import { Observable } from "rxjs/Rx";
import {RealtimeService} from "../realtime/realtime.service";

@Injectable()
export class AuthService {
    token: any;
    users: User[] = [];
    isLoggedIn: boolean = false;

    constructor(private _http: Http, private _realtime: RealtimeService) {
        _realtime.observeEvent('online')
            .filter(u => u._id !== localStorage.getItem('userId'))
            .subscribe(u => { console.log('user online:' + u); this.users.push(u) });

        this.isLoggedIn = localStorage.getItem('token') !== null;
    }

    signup(user: User): Observable<User> {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const url = '/user';

        return this._http.post(url, body, { headers: headers })
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    signin(user: User): any {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const url = '/user/signin';

        return this._http.post(url, body, { headers: headers })
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    getFriends(id: string, t: any) {
        const token: string = t ? `?token=${t}` : '';

        const url = `/user/${id}/friends${token}`;

        this._http.get(url)
            .map(response => <User[]>response.json())
            .catch(error => Observable.throw(error))
            .subscribe((items: User[]) => {
                items.forEach((v: User) => {
                    let u = new User(v.email, v.loggedIn);
                    this.users.push(u);
                });
            });
    }

    private signout(): void {
        const t: any = localStorage.getItem('token');
        const token: string = t ? `?token=${t}` : '';
        const id: string = localStorage.getItem('userId');

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const url = `/user/signout/${id}${token}`;

        this._http.post(url, { id: id }, { headers: headers })
            .map(response => <User[]>response.json())
            .catch(error => Observable.throw(error.json()))
            .subscribe();
    }

    logout() {
        this.isLoggedIn = false;
        this.signout();

        localStorage.clear();
    }
}