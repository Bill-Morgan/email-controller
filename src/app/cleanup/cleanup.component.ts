import { Component, OnInit } from '@angular/core';
import { EmailApiService } from '../email-api.service';

@Component({
  selector: 'app-cleanup',
  templateUrl: './cleanup.component.html',
  styleUrls: ['./cleanup.component.css']
})
export class CleanupComponent implements OnInit {

  constructor(private emailSC: EmailApiService) { }

  ngOnInit(): void {
  }

  onDeleteAllGroups() {
    this.emailSC.deleteAllGroups();
  }

}
