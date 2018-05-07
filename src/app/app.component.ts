import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LoginStatusService } from './service/token/login-status.service';
import { InitialLoginStatus } from './interface/login-status/initial-login-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: Observable<String> = this.initialStatus.username;
  constructor(private http: HttpClient, private router: Router, private loginStatus: LoginStatusService, private initialStatus: InitialLoginStatus){}

  logOut(): void {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.loginStatus.getToken()
    });

    this.http.post('/member/logout', {observe: 'response', headers: headers}).subscribe(res => {
      this.loginStatus.removeToken();
      this.initialStatus.setInitialStatus();
      this.router.navigate(['/signin']);
    },err => {
      console.log(err);
    });
  }
  ngOnInit() {
    this.initialStatus.setInitialStatus();
  }
}
