import {Injectable, EventEmitter} from "@angular/core";
import {Error} from "./error";

@Injectable()
export class ErrorService {
    errorOccurred: EventEmitter<Error> = new EventEmitter<Error>();

    handleError(error: Error) {
        console.log(error);
        this.errorOccurred.emit(error);
    }
}