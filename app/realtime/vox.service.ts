import {Injectable, EventEmitter } from '@angular/core';
import { RealtimeService } from "./realtime.service";

@Injectable()
export class VoxService {
    private configuration: RTCConfiguration = {
        iceServers: [
            { urls: ['stun:stun.l.google.com:19302'] }
        ]
    };

    private _pc: any = null;

    onLocalStream: (stream: MediaStream) => void;
    onRemoteStream: (stream: MediaStream) => void;

    constructor(private _realtimeService: RealtimeService) {
        this._realtimeService.observeEvent('signal')
            .subscribe((m) => this.handleSignal(m));
    }

    handleSignal(message: any): void {
        console.log('signal');

        if (!this._pc)
            this.startPC();

        if (message.connected) {
            return;
        }
        else if (message.desc) {
            var desc = message.desc;

            // if we get an offer, we need to reply with an answer
            if (desc.type == "offer") {
                this._pc.setRemoteDescription(desc)
                    .then(() => {
                        return this._pc.createAnswer();
                    })
                    .then((answer) => {
                        return this._pc.setLocalDescription(answer);
                    })
                    .then(() => {
                        this._realtimeService.emitEvent('signal', {"desc": this._pc.localDescription});
                    })
                    .catch(this.logError);
            }
            else if (desc.type == "answer") {
                this._pc.setRemoteDescription(desc)
                    .catch(this.logError);
            }
            else {
                log("Unsupported SDP type. Your code may differ here.");
            }
        }
        else {
            console.log('Ice: ' + message.candidate);
            this._pc.addIceCandidate(message.candidate)
                .catch(this.logError);
        }
    }

    // call start() to initiate
    startPC(): void {
        this._pc = new RTCPeerConnection(this.configuration);

        // send any ice candidates to the other peer
        this._pc.onicecandidate = (evt) => {
            console.log('ice: ' + evt.candidate);

            if (evt.candidate)
                this._realtimeService.emitEvent('signal', {"candidate": evt.candidate});
        };

        // let the "negotiationneeded" event trigger offer generation
        this._pc.onnegotiationneeded = () => {
            console.log('negotiate');
            this._pc.createOffer()
                .then((offer) => {
                    return this._pc.setLocalDescription(offer);
                })
                .then(() => {
                    // send the offer to the other peer
                    this._realtimeService.emitEvent('signal', {"desc": this._pc.localDescription});
                })
                .catch(this.logError);
        };

        // once remote video track arrives, show it in the remote video element
        this._pc.ontrack = (evt: any) => {
            console.log('track');
            if (evt.track.kind === "audio") {
                //this.emit('remoteStream', evt.streams[0]);
                //remoteView.srcObject = evt.streams[0];
                this.onRemoteStream(evt.streams[0]);
            }
        };

        // get a local stream, show it in a self-view and add it to be sent
        navigator.mediaDevices.getUserMedia({"audio": true, "video": false})
            .then((stream: MediaStream) => {
                this.onLocalStream(stream);
                this._pc.addStream(stream);
            })
            .catch(this.logError);
    }

    logError(err: any): void {
        console.error(err);
    }
}