import { Component, OnInit } from '@angular/core';
import { VoxService } from "../realtime/vox.service";
import {DomSanitizationService} from "@angular/platform-browser";

@Component({
    selector: 'my-com',
    template: `
        <h4 class="header-footer header-radius">Com Service</h4>
        
        <div class="header-footer message" *ngFor="let stream of streams">
            <audio autoplay controls [src]="stream"></audio>
        </div>
        
        <h4 class="header-footer footer-radius">I Rock!</h4>
    `,
    styleUrls: [
        'css/main.css'
    ]
})
export class ComComponent implements OnInit {
    streams: any[] = [];

    constructor(private _vox: VoxService, private _sanitize: DomSanitizationService) { }

    ngOnInit() {
        this._vox.onLocalStream = (stream: MediaStream) => {
            //this.streams.push(window.URL.createObjectURL(stream));
        }

        this._vox.onRemoteStream = (stream: MediaStream) => {
            var url = this._sanitize.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
            console.log("url: " + url);
            this.streams.push(url);
        }
    }
}