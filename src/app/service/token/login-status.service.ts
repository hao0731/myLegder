import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginStatusService {

  memberInfo: any = 'default';

  constructor(private http: HttpClient) { }

  saveToken(token:any): void {
    localStorage.setItem('app-token', token);
  }

  getToken(): any {
    return localStorage.getItem('app-token');
  }

  removeToken(): void {
    localStorage.removeItem('app-token');
  }

  isLogin(): any {
    let token = this.getToken();
    if(token) {
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    }
    else {
      return false;
    }
  }

  getCurrentUser(): any {
    if(this.isLogin()) {
      let token = this.getToken();
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      return {
        username: payload.username,
        email: payload.email
      };
    }
    else {
      return false;
    }
  }
}
