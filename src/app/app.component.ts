import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse ,HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LoginStatusService } from './service/token/login-status.service';
import { InitialLoginStatus } from './interface/login-status/initial-login-status';
declare let $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  username: Observable<String> = this.initialStatus.username;
  searchLedger:any = ['loading'];
  searchForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginStatus: LoginStatusService, private initialStatus: InitialLoginStatus){
    this.searchForm = fb.group({
      ledgerName: ['', [Validators.required]]
    });
  }

  submitSearchForm(value:any) {
    this.searchLedger = ['loading'];
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.loginStatus.getToken()
    });
    let httpParams = new HttpParams();
     Object.keys(value).forEach((key) => {
         httpParams = httpParams.append(key, value[key]);
     });
    this.http.get('/api/ledgers', {observe: 'response', headers: headers, params: value}).subscribe(res => {
      this.searchLedger = res['body']['data'];
    },(err: HttpErrorResponse) => {
      this.searchLedger[0] = (err['error']['message']);
    });
  }

  hideModal() {
    $('#searchLedgerModal').modal('hide');
  }

  logOut(): void {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.loginStatus.getToken()
    });

    this.http.post('/member/logout', {observe: 'response', headers: headers}).subscribe(res => {
      this.loginStatus.removeToken();
      this.initialStatus.setInitialStatus();
      this.router.navigate(['/signin']);
    },(err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.initialStatus.setInitialStatus();
  }
}
