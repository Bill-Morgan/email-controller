import { Component, OnInit } from '@angular/core';
import { EmailApiService } from './email-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'email-controller';
  isLoggedIn = false;

  constructor(public emailSC: EmailApiService){}

  ngOnInit() {
    
  }
}
