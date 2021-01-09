import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailGroupModule } from './email-group/email-group.module';
import { UserModule } from './user/user.module';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class EmailApiService {
  url = 'http://mail.wamcomputers.com/';

  authPath = 'api/v1/auth/authenticate-user';
  getDomainEventList = "api/v1/settings/domain/domain-events"
  getDomainEventHookByGuidPath = "api/v1/settings/domain/event-hook/"
  getDomainEventHooksByOwnerPath = "api/v1/settings/domain/event-hooks-by-owner";
  getAllUserGroupsPath = "api/v1/settings/domain/all-user-groups";
  getUserGroupByIdPath = "api/v1/settings/domain/user-group/";
  createUserGroupPath = "api/v1/settings/domain/user-group-put"
  listUsersPath = "api/v1/settings/domain/list-users"

  supervisorGroupId = "-1";
  emailGroups: EmailGroupModule[] = [];
  userEvent = new EventEmitter();

  users: UserModule[] = [];

  accessToken = null;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.users.slice();
  }

  login(username: string, password: string) {
    let postInputs = { "username": username, "password": password }
    let fullUrl = this.url + this.authPath
    this.http.post(fullUrl, postInputs)
      .subscribe((results) => {
        console.log(results);
        if (results['isDomainAdmin']) {
          this.accessToken = "Bearer " + results["accessToken"];
          this.listUsers();
        }
      }
      )
  }

  getEventList() {
    let fullUrl = this.url + this.getDomainEventList
    this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
  }

  getEventHookByGuid() {
    let fullUrl = this.url + this.getDomainEventHookByGuidPath
    this.http.get(fullUrl + '3001', { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log(results);
      })
  }

  getEventHooksByOwner() {
    let fullUrl = this.url + this.getDomainEventHooksByOwnerPath
    let postInputs = { "name": "", "sortDescending": true, "count": 100, "startIndex": 0 }
    this.http.post(fullUrl, postInputs, { headers: { "Authorization": this.accessToken } })
      .subscribe((results) => {
        console.log("event hooks by owner")
        console.log(results);
      })
  }

  getAllUserGroups() {
    let fullUrl = this.url + this.getAllUserGroupsPath;
    return this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
  }

  listUsers() {
    let fullUrl = this.url + this.listUsersPath;
    let tempusers: UserModule[] = [];
    let supervisors: string[] = []
    this.getSupervisorGroupId().then((data) => {
      this.supervisorGroupId = data;
      console.log("groupId = " + this.supervisorGroupId);
      this.getUserGroupById(this.supervisorGroupId).subscribe((results) => {
        supervisors = results['userNames']
      });
      this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
        .subscribe((results) => {
          for (let eachUser of results['userData']) {
            let isSuper = (supervisors.indexOf(eachUser['username']) >= 0)
            tempusers.push({ "username": eachUser['userName'], "supervisor": isSuper });
          }
          this.users = tempusers.sort((a, b) => {
            if (a.username < b.username) {
              return -1
            } else {
              return 1
            }
          })
        });
    });
    console.log(this.users);
  }

  getUserGroupById(id: string) {
    let fullUrl = this.url + this.getUserGroupByIdPath + id;
    return this.http.get(fullUrl, { headers: { "Authorization": this.accessToken } })
  }

  getSupervisorGroupId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getAllUserGroups()
        .subscribe((results) => {
          console.log(results);
          for (let eachGroup of results['userGroupCollection']['customUserGroups']) {
            console.log(eachGroup);
            console.log(eachGroup['name'])
            if (eachGroup['name'] == "Supervisors") {
              console.log("supervisor found");
              resolve(<string>eachGroup['id']);
              break;
            }
          }
          if (this.supervisorGroupId == "-1") {
            // this.createUserGroup("Supervisors")
            //   .subscribe((results) => {
            //     this.supervisorGroupId = results['id'];
            //     resolve(<string>results['id']);
            //   });
          }
        })
      reject(<string>"-1");
    });
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
    return this.http.post(fullUrl, postInputs, { headers: { "Authorization": this.accessToken } })
  }

  onSaveSupervisors(allUsers: UserModule) {

  }

}
