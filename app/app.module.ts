import { NgModule } from '@angular/core';
import { AppComponent } from "./app.component";
import { BrowserModule } from '@angular/platform-browser'
import { MessageService} from "./message/message.service";
import { AuthService} from "./auth/authentication.service";
import { ErrorService} from "./errors/error.service";
import { RealtimeService} from "./realtime/realtime.service";
import { VoxService} from "./realtime/vox.service";
import { HttpModule } from "@angular/http";
import { appRouterProviders } from "./app.routes";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    providers: [
        MessageService,
        AuthService,
        ErrorService,
        RealtimeService,
        VoxService,
        appRouterProviders,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }