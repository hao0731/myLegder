import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginStatusService } from '../../service/token/login-status.service';
import { ChangeLoginStatus } from '../signin/interface/change-login-status';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  alertMessage = 'loading';
  validRule = {
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
    username:  /^[\d|a-zA-Z]+$/
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginStatus: LoginStatusService, private changeStatus: ChangeLoginStatus) {
      this.signupForm = fb.group({
        username : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(this.validRule['username'])]],
        password: ['', [Validators.required]],
        email : ['', [Validators.required, Validators.pattern(this.validRule['email'])]]
      })
  }

  submitForm(value: any): void {
    this.http.post('/member/signup',value, { observe: 'response' }).subscribe(res => {
      this.alertMessage ='ok';
      this.loginStatus.saveToken(res['body']['token']);
      this.changeStatus.changeStatus();
      this.router.navigate(['/']);
    },(err: HttpErrorResponse) => {
      this.alertMessage = err.error['message'];
      this.resetInput();
    });
  }

  resetInput(): void {
    this.signupForm = this.fb.group({
      username : ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required]],
      email : ['', [Validators.required, Validators.pattern(this.validRule['email'])]]
    })
  }

  ngOnInit() {
    if(this.loginStatus.isLogin()) this.router.navigate(['/']);
  }
}
