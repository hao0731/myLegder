import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LoginStatusService } from './login-status.service';
import { InitialLoginStatus } from '../../interface/login-status/initial-login-status';
import { ChangeLoginStatus } from '../../component/signin/interface/change-login-status';


@Injectable()
export class DealLoginStatusService implements InitialLoginStatus, ChangeLoginStatus {
  constructor(private http: HttpClient, private loginStatus: LoginStatusService) {}
  private usernameStore: BehaviorSubject<String> = new BehaviorSubject<String>('使用者');
  username: Observable<String> = this.usernameStore;
  setInitialStatus(): void {
    this.resetStatus();
  }

  changeStatus(): void {
    this.resetStatus();
  }

  resetStatus(): void {
    let userInfo = this.loginStatus.getCurrentUser();
    let name = (userInfo)?userInfo['username']:'使用者';
    this.usernameStore.next(name);   
  }
}
