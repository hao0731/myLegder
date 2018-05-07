import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginStatusService } from '../../service/token/login-status.service';
import { ChangeLoginStatus } from './interface/change-login-status';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm : FormGroup;
  alertMessage = 'loading';

  constructor(private fb: FormBuilder, private http: HttpClient, private loginStatus: LoginStatusService, private changeStatus: ChangeLoginStatus) {
      this.signinForm = fb.group({
        username : ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required]]
      })
  }

  submitForm(value: any): void {
    this.http.post('/member/signin',value, { observe: 'response' }).subscribe(res => {
      if(res['status'] == 200 && res['body']['token']) {
        this.alertMessage ='ok';
        this.loginStatus.saveToken(res['body']['token']);
        this.changeStatus.changeStatus();
      }
      else {
        this.alertMessage = res['body']['message'];
      }
    });
  }

  ngOnInit() {
  }

}
