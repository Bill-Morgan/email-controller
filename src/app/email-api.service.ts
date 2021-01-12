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
  removeUserFromGroupPath = "api/v1/settings/domain/remove-from-user-groups/"
  addUserToGroupPath = 'api/v1/settings/domain/add-to-user-groups/'
  removeUserGroupsPath = 'api/v1/settings/domain/remove-user-groups'

  supervisorGroupId = "-1";
  emailGroups: EmailGroupModule[] = [];
  userEvent = new EventEmitter();
  supervisors: string[] = [];

  users: UserModule[] = [];


  loggedIn = false;

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
          this.getUserData().then((data) => {
            this.loggedIn = true;
          });
        }
      }
      )
  }

  getUserData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let fullUrl = this.url + this.listUsersPath;
      let tempusers: UserModule[] = [];
      this.getSupervisorGroupId().then((data) => {
        this.supervisorGroupId = data;
        console.log("groupId = " + this.supervisorGroupId);
        this.getUserGroupById(this.supervisorGroupId).subscribe((results) => {
          console.log("should show supervisors");
          console.log(results);
          if (results['userNames']) {
            this.supervisors = results['userNames']
          }
        });
        this.http.get(fullUrl)
          .subscribe((results) => {
            for (let eachUser of results['userData']) {
              let isSuper = (this.supervisors.indexOf(eachUser['username']) >= 0)
              tempusers.push({ "username": eachUser['userName'], "supervisor": isSuper });
            }
            this.users = tempusers.sort((a, b) => {
              if (a.username < b.username) {
                return -1
              } else {
                return 1
              }
            })
            resolve(true);
          });
      });
      console.log(this.users);
    })
  }

  getUserGroupById(id: string) {
    let fullUrl = this.url + this.getUserGroupByIdPath + id;
    return this.http.get(fullUrl)
  }

  getSupervisorGroupId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getAllUserGroups()
        .subscribe((results) => {
          console.log(results);
          if (results['userGroupCollection']['customUserGroups']) {
            for (let eachGroup of results['userGroupCollection']['customUserGroups']) {
              console.log(eachGroup);
              console.log(eachGroup['name'])
              if (eachGroup['name'] == "Supervisors") {
                // console.log("supervisor found");
                this.supervisorGroupId = eachGroup['id']
                resolve(<string>eachGroup['id']);
                break;
              }
            }
          }
          if (this.supervisorGroupId == "-1") {
            console.log('creating usergroup')
            this.createUserGroup("Supervisors")
              .subscribe((results) => {
                this.supervisorGroupId = results['id'];
                resolve(<string>results['id']);
              });
          }
        })
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
    return this.http.post(fullUrl, postInputs)
  }

  onSaveSupervisors() {
    let removeUsers = [];
    let addUsers = [];
    let index = 0;
    for (let user of this.users) {
      if (user.supervisor) {
        if (this.supervisors.indexOf(user.username) < 0) {
          addUsers.push(user.username);
        }
      } else {
        if (this.supervisors.indexOf(user.username) >= 0) {
          removeUsers.push(user.username);
        }
      }
    }
    if (removeUsers.length > 0) {
      this.removeUsersFromGroup(addUsers).then(result => {
        if (!result) { throw ("error removing users from supervisors") }
        this.addUsersToGroup(addUsers).then(result => {
          if (!result) { throw ("error adding users to supervisors") }
          this.addUsersToGroup(addUsers).then(result => {
            if (!result) { throw ("error adding users to supervisors") }
          })
        })
      })
    } else {
      if (addUsers.length > 0) {
        this.addUsersToGroup(addUsers).then(result => {
          if (!result) { throw ("error adding users to supervisors") }
        })
      }
    }
    console.log("remove users: ");
    console.log(removeUsers);
    console.log("add users: ");
    console.log(addUsers);
  }

  addUsersToGroup(usernames: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let fullUrl = this.url + this.addUserToGroupPath
      let postInputs = {
        "iDs":
          [
            this.supervisorGroupId
          ]
      }
      for (let username of usernames) {
        let success: boolean;
        this.http.post(fullUrl + username, postInputs).subscribe((data) => {
          console.log(data);
          success = data['success'];
          if (!success) {
            throw ('error adding user ' + username + ' from supervisors.');
          }
        });
      }
      resolve(true);
    })
  }

  removeUsersFromGroup(usernames: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let fullUrl = this.url + this.removeUserFromGroupPath
      let postInputs = {
        "iDs":
          [
            parseInt(this.supervisorGroupId)
          ]
      }
      for (let username of usernames) {
        let success;
        this.http.post(fullUrl + username, postInputs).subscribe((data) => {
          success = data['success'];
        });
        if (!success) {
          throw ('error removing user ' + username + ' from supervisors.');
        }
      }
      resolve(true);
    })
  }

  getEventList() {
    let fullUrl = this.url + this.getDomainEventList
    this.http.get(fullUrl)
      .subscribe((results) => {
        console.log(results);
      })
  }

  getEventHookByGuid() {
    let fullUrl = this.url + this.getDomainEventHookByGuidPath
    this.http.get(fullUrl + '3001')
      .subscribe((results) => {
        console.log(results);
      })
  }

  getEventHooksByOwner() {
    let fullUrl = this.url + this.getDomainEventHooksByOwnerPath
    let postInputs = { "name": "", "sortDescending": true, "count": 100, "startIndex": 0 }
    this.http.post(fullUrl, postInputs)
      .subscribe((results) => {
        console.log("event hooks by owner")
        console.log(results);
      })
  }

  getAllUserGroups() {
    let fullUrl = this.url + this.getAllUserGroupsPath;
    return this.http.get(fullUrl)
  }

  deleteAllGroups() {
    this.getAllUserGroups().subscribe((results) => {
      let groups: { 'name': string, 'id': string }[] = results['userGroupCollection']['customUserGroups']
      let allGroupIds = groups.map((eachUG) => { return eachUG['id'] });
      let postInputs = { "iDs": allGroupIds }
      let fullUrl = this.url + this.removeUserGroupsPath
      this.http.post(fullUrl, postInputs).subscribe((results) => {
        console.log(results);
      })
    })
  }

}
