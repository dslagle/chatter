import { User } from "../auth/user";
import {RealtimeService} from "./realtime.service";

export class Peer {
    private _pc: RTCPeerConnection;
    private _user: User;

    // constructor(u: User) {
    //     this._user = u;
    // }

    private configuration: RTCConfiguration = {
        iceServers: [
            { urls: ['stun:stun.l.google.com:19302'] }
        ]
    };

    onLocalStream: (stream: MediaStream) => void;
    onRemoteStream: (stream: MediaStream) => void;

    constructor(private _realtimeService: RealtimeService) {
        this._realtimeService.observeEvent('rtc')
            .subscribe((m) => this.handleRtc(m));
    }

    handleRtc(data: any): void {
        console.log('rtc');

        if (!this._pc)
            this.startPC();

        if (data.type == "offer") {
            this.handleOffer(data);
        }
        else if (data.type == "answer") {
            this.handleAnswer(data);
        }
        else if (data.type == "ice") {
            this.handleIce(data);
        }
        else {
            console.log("Unsupported SDP type. Your code may differ here.");
        }
    }

    private handleOffer(data: any) {
        this._pc.setRemoteDescription(data.data)
            .then(() => {
                return this._pc.createAnswer();
            })
            .then((answer) => {
                return this._pc.setLocalDescription(answer);
            })
            .then(() => {
                this._realtimeService.emitEvent('rtc', { to: this._user._id, type: "answer", data: this._pc.localDescription });
            })
            .catch(this.logError);
    }

    private handleAnswer(data: any) {
        this._pc.setRemoteDescription(data.data)
            .catch(this.logError);
    }

    private handleIce(data: any) {
        console.log('Ice: ' + data.candidate);
        this._pc.addIceCandidate(data.candidate)
            .catch(this.logError);
    }

    startPC(): void {
        console.log("start");
        this._pc = new RTCPeerConnection(this.configuration);

        // send any ice candidates to the other peer
        this._pc.onicecandidate = (evt) => {
            console.log('ice: ' + evt.candidate);

            if (evt.candidate) {
                this._realtimeService.emitEvent('rtc', { to: this._user._id, type: "ice", data: evt.candidate });
            }
        };

        this._pc.onnegotiationneeded = () => {
            console.log('negotiate');

            this._pc.createOffer()
                .then((offer) => {
                    return this._pc.setLocalDescription(offer);
                })
                .then(() => {
                    // send the offer to the other peer
                    this._realtimeService.emitEvent('rtc', { to: this._user._id, type: "offer", data: this._pc.localDescription });
                })
                .catch(this.logError);
        };

        this._pc.onaddstream = (evt: any) => {
            console.log('track');

            if (evt.track.kind === "audio") {
                this.onRemoteStream(evt.streams[0]);
            }
        };
    }

    logError(err: any): void {
        console.error(err);
    }
}