import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const auth=getAuth()
    console.log('auth:', auth)

  }

}
