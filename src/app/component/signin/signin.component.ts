import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginStatusService } from '../../service/token/login-status.service';
import { ChangeLoginStatus } from './interface/change-login-status';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm : FormGroup;
  alertMessage = 'loading';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginStatus: LoginStatusService, private changeStatus: ChangeLoginStatus) {
      this.signinForm = fb.group({
        username : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        password: ['', [Validators.required]]
      })
  }

  submitForm(value: any): void {
    this.http.post('/member/signin',value, { observe: 'response' }).subscribe(res => {
      this.alertMessage ='ok';
      this.loginStatus.saveToken(res['body']['token']);
      this.changeStatus.changeStatus();
      this.router.navigate(['/']);
    },(err: HttpErrorResponse) => {
      this.alertMessage = err.error['message'];
    });
  }

  ngOnInit() {
    if(this.loginStatus.isLogin()) this.router.navigate(['/']);
  }

}
