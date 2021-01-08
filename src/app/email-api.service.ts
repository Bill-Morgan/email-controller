import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailGroupModule } from './email-group/email-group.module';

@Injectable({
  providedIn: 'root'
})
export class EmailApiService {
  private url = 'http://mail.wamcomputers.com/';
  private authPath = 'api/v1/auth/authenticate-user';
  private getDomainEventList = "api/v1/settings/domain/domain-events"
  private getDomainEventHookByGuidPath = "api/v1/settings/domain/event-hook/"
  private getDomainEventHooksByOwnerPath = "api/v1/settings/domain/event-hooks-by-owner";
  private getAllUserGroupsPath = "api/v1/settings/domain/all-user-groups";
  private getUserGroupByIdPath = "api/v1/settings/domain/user-group/";
  private createUserGroupPath = "api/v1/settings/domain/user-group-put"
  private emailGroups: EmailGroupModule[] = [];

  public accessToken;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    let postInputs = { "username": username, "password": password }
    let fullUrl = this.url + this.authPath
    return this.http.post(fullUrl, postInputs);
  }

  getEventList() {
    let fullUrl = this.url + this.getDomainEventList
    this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
  }

  getEventHookByGuid() {
    let eventList = [3000, 30001, 30004, 30005] //, 20006, 200007, 200010, 20011, 200012,
    //200013, 200014, "bd105393546a4ac99e36df13ff29ed1d"]
    let fullUrl = this.url + this.getDomainEventHookByGuidPath
    this.http.get(fullUrl + '3001', { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
    // this.http.get(fullUrl + "bd105393546a4ac99e36df13ff29ed1d", {headers: {"Authorization": this.accessToken}})
    // .subscribe((results) => {
    //   console.log(results);
    // });
  }

  geEventHooksByOwner() {
    let fullUrl = this.url + this.getDomainEventHooksByOwnerPath
    let postInputs = { "name": "", "sortDescending": true, "count": 100, "startIndex": 0 }
    this.http.post(fullUrl, postInputs, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
  }

  getAllUserGroups() {
    let fullUrl = this.url + this.getAllUserGroupsPath;
    this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results['userGroupCollection']['customUserGroups']);
        for (let eachGroup of results['userGroupCollection']['customUserGroups']) {
          this.emailGroups.push(eachGroup);
        }
        console.log(this.emailGroups);
      })
  }

  getUserGroupById(id: string) {
    let fullUrl = this.url + this.getUserGroupByIdPath + id;
    this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
  }

  createUserGroup(userGroup: string) {
    let fullUrl = this.url + this.createUserGroupPath;
    let postInputs = {
      "userGroup":
      {
        "name": userGroup,
      }
    }
    // this.getUserGroupById(userGroup);
    this.http.post(fullUrl, postInputs, { headers: { "Authorization": this.accessToken } })
    .subscribe((results) => {
      console.log(results);
    })
  }

}
