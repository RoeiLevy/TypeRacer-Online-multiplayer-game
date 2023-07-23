import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
// import { environment } from '././../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  // BASE_URL = environment.production
  //   ? '/'
  //   : '//localhost:3000';
  socket: any

  async setup() {
    this.socket = io('http://localhost:3000')
  }
  on(eventName: any, cb: any) {
    this.socket.on(eventName, cb)
  }
  off(eventName: any, cb = null) {
    if (!this.socket) return;
    if (!cb) this.socket.removeAllListeners(eventName)
    else this.socket.off(eventName, cb)
  }
  emit(eventName: any, data: any) {
    this.socket.emit(eventName, data)
  }
  terminate() {

    this.socket = null
  }
}
