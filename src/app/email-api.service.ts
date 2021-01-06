import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailApiService {
  private url = 'http://mail.yourtravelservices.org/';
  private authPath = 'api/v1/auth/authenticate-user';
  private getDomainEventList = "api/v1/settings/domain/domain-events"

  public accessToken;
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    let postInputs = {"username": username, "password": password}
    let fullUrl = this.url + this.authPath
    return this.http.post(fullUrl, postInputs);
  }

  getEventList () {
    let fullUrl = this.url + this.getDomainEventList
    this.http.get(fullUrl, {headers: {"Authorization": this.accessToken}})
      .subscribe((results) => {
      console.log(results);
    })
  }

}
