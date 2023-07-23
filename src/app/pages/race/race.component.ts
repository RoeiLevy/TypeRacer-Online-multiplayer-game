import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
// import { Quote } from 'src/app/interfaces/quote'
import { SocketService } from 'src/app/services/socket.service'

@Component({
  selector: 'race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  @ViewChild('myInput') input: ElementRef

  nextLetterIdx: number = 0
  typedText: string = ""
  room: any
  isGameOn: boolean = false
  player: any = {
    id: Math.random().toString(36).substring(2),
    username: `Guest-${Math.random().toString(36).substring(2)}`,
    progress: 0
  }
  wpm: number = 0
  isMistyped: boolean = false

  checkLetter(ev: any) {
    if (ev.inputType === 'deleteContentBackward') {
      if (!this.isMistyped) this.nextLetterIdx--
      return
    } else {
      const lastTypedLetter = this.typedText.charAt(this.typedText.length - 1)
      const nextLetter = this.room.quote.text.charAt(this.nextLetterIdx)
      if (nextLetter === lastTypedLetter) {
        this.nextLetterIdx++
        this.isMistyped = false
      }
      else this.isMistyped = true
    }
    this.player.progress = this.getProgress()
    if (this.player.progress === 100) this.isGameOn = false
    this.socketService.emit('update-progress', { player: this.player, roomId: this.room.id })
  }

  getLetterColor(letterIdx: number) {
    if (letterIdx < this.typedText.length && letterIdx >= this.nextLetterIdx) {
      return 'red'
    } else if (letterIdx < this.nextLetterIdx) return 'green'
    return 'black'
  }

  getProgress() {
    return this.nextLetterIdx / this.room.quote.text.length * 100
  }

  getTime() {
    if (this.room.startTimestamp) return (this.room.startTimestamp - Date.now()) / 1000
    return 0
  }

  updateRoom(room: any) {
    room.players.sort((a: any, b: any) => a.id === this.player.id ? -1 : b.id === this.player.id ? 1 : 0)
    this.room = room
  }

  startGame() {
    this.isGameOn = true
    setTimeout(() => this.input.nativeElement.focus(), 0)
  }

  getResults(timer) {
    const wpm = ((60 / timer) * this.room.quote.text.split(' ').length)
    this.player.wpm = +wpm.toFixed(0)
    this.player.timeToFinish = timer
    this.socketService.emit('end-game', { player: this.player, roomId: this.room.id })
  }

  ngOnInit(): void {
    this.socketService.setup()
    this.socketService.emit('play', this.player)
    this.socketService.on('add-player', (room: any) => this.updateRoom(room))
    this.socketService.on('update-progress', (room: any) => this.updateRoom(room))
    this.socketService.on('show-winners', (room: any) => this.updateRoom(room))
    this.socketService.on('remove-player', (room: any) => this.updateRoom(room))
  }

  ngOnDestroy(): void {
    this.socketService.emit('leave', null)
    this.socketService.terminate()
  }

}
