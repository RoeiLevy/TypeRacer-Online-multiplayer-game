import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stopwatch'
})
export class StopwatchPipe implements PipeTransform {
  transform(timeElasped: number, ...args: unknown[]): string {
    if (timeElasped < 1000) {
      return '00:00'
    } else if (timeElasped < 10000) {
      return `00:0${Math.floor(timeElasped / 1000)}`
    } else if (timeElasped < 60000) {
      return `00:${Math.floor(timeElasped / 1000)}`
    } else if (timeElasped % 60000 < 10000) {
      if (timeElasped / 60000 < 10) return `0${Math.floor(timeElasped / 60000)}:0${Math.floor(timeElasped % 60000 / 1000)}`
      return `${Math.floor(timeElasped / 60000)}:0${Math.floor(timeElasped % 60000 / 1000)}`
    } else {
      if (timeElasped / 60000 < 10) return `0${Math.floor(timeElasped / 60000)}:${Math.floor(timeElasped % 60000 / 1000)}`
      return `${Math.floor(timeElasped / 60000)}:${Math.floor(timeElasped % 60000 / 1000)}`
    }
  }
}
