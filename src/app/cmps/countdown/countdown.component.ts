import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Input() time: number
  @Input() isGameOn: boolean
  @Output() enableInput = new EventEmitter()
  @Output() emitTimer = new EventEmitter()

  displayTime: number = 0
  timer: number = 0
  msg: string = ''
  intervalId: any

  constructor() { }

  clearMsg() {
    setTimeout(() => {
      this.msg = ''
    }, 1000)
  }

  startTimer() {
    this.enableInput.emit()
    this.msg = 'Let\'s go!'
    this.clearMsg()
    this.intervalId = setInterval(() => {
      this.timer++
      if (this.timer < 10) {
        this.displayTime = this.timer * 1000
      } else {
        this.displayTime = this.timer * 1000
      }
    }, 1000)
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const seconds = (this.time - Date.now())
      if (seconds <= 0) {
        clearInterval(this.intervalId)
        this.startTimer()
      } else {
        this.displayTime = seconds
      }
    }, 1000)
  }

  ngOnChanges(changes) {
    if (!changes.isGameOn.currentValue && changes.isGameOn.previousValue) {
      clearInterval(this.intervalId)
      this.emitTimer.emit(this.timer)
    }
  }

}
