import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EmailApiService } from '../email-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private emailSC: EmailApiService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      "username": new FormControl(null),
      "password": new FormControl(null)
    });
  }

  onSubmit() {
    console.log("submit pressed");
    this.emailSC.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
      // this.emailSC.getEventList();
      // this.emailSC.geEventHooksByOwner();
      // this.emailSC.getAllUserGroups();
      // this.emailSC.getUserGroupById('2')
      // this.emailSC.createUserGroup("Supervisors");
      // this.emailSC.listUsers();
  }

}
