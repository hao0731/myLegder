import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../service/token/login-status.service';
import { ChangeLoginStatus } from '../signin/interface/change-login-status';


@Component({
  selector: 'account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  updateForm: FormGroup;
  alertMessage:String = 'loading';
  validRule = {
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
    username:  /^[\d|a-zA-Z]+$/
  }

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient, private loginStatus: LoginStatusService, private changeStatus: ChangeLoginStatus) { 
    this.updateForm = fb.group({
      'username':['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(this.validRule['username'])]],
      'email':['', [Validators.required, Validators.pattern(this.validRule['email'])]],
      'password':'',
      'editOptions': {
        'username': false,
        'email': false,
        'password': false
      }
    })
  }

  getEditStatus(value:any): void {
    if(this.updateForm.controls['editOptions'][value]) {
      this.updateForm.controls['editOptions'][value] = false;
      this.updateForm.patchValue({
        value: ''
      })
    }
    else {
      this.updateForm.controls['editOptions'][value] = true;
    }
  }

  submitForm(value:any): void {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer'+this.loginStatus.getToken()
    })
    this.http.post('/member/update',{observe:'response', headers: headers}).subscribe(res => {
      this.alertMessage = 'ok';
      this.loginStatus.removeToken();
      this.loginStatus.saveToken(res['body']['token']);
      this.changeStatus.changeStatus();

    }),(err: HttpErrorResponse) => {
      this.alertMessage = err.error['message'];
    };
  }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
  }

}
