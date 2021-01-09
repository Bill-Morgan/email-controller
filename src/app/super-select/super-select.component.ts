import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EmailApiService } from '../email-api.service';
import { UserModule } from '../user/user.module';

@Component({
  selector: 'app-super-select',
  templateUrl: './super-select.component.html',
  styleUrls: ['./super-select.component.css']
})
export class SuperSelectComponent implements OnInit {
  superForm: FormGroup;
  // superSelected: string[] = [];
  // nonSuperSelected: string[] = [];
  users: UserModule[] = [];
  buttonTxt = "----";
  buttonDisabled = false;

  constructor(private zone: NgZone, private emailSC: EmailApiService) { }

  ngOnInit(): void {
    this.users = this.emailSC.users;
    this.superForm = new FormGroup({
      'superSelected': new FormControl([]),
      'nonSuperSelected': new FormControl([])
    })
  }

  onFocus(box: string) {
    if (box === "super") {
      this.buttonTxt = ">>>>";
      this.superForm['superSelected'] = [];
    } else if (box === "notSuper") {
      this.buttonTxt = "<<<<"
      this.superForm['superSelected'] = [];
    } else {
      this.buttonTxt = "----"
    }
    this.users = [];
    this.users = this.emailSC.users;
  }

  onBtnClick() {
    let usernames = this.users.map((user) => {return user.username});
    if (this.buttonTxt === "<<<<") {
      let newSupers = this.superForm.get('nonSuperSelected').value;
      console.log(newSupers);
      for (let newSuper of newSupers) {
        this.users[usernames.indexOf(newSuper)].supervisor = true;
      }
    }
    if (this.buttonTxt === ">>>>") {
      let removeSupers = this.superForm.get('superSelected').value;
      console.log(removeSupers);
      for (let removeSuper of removeSupers) {
        this.users[usernames.indexOf(removeSuper)].supervisor = false;
      }
    }
  }

  updateUsers() {
    for (let user of this.users) {
      // user.supervisor = this.supervisors.indexOf(user.username) >= 0;
    }

  }

  onSubmit() {

  }

}
