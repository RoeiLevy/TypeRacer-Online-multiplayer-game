import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private $subject = new Subject();

  constructor() { }

  emit(event: any) {
    this.$subject.next(event);
  }

  on(event: any) {
    return this.$subject.asObservable().pipe(filter((e:any) => e.type === event));
  }
}
