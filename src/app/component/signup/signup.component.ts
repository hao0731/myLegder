import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginStatusService } from '../../service/token/login-status.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  alertMessage = 'loading';
  validRule = {
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private loginStatus: LoginStatusService) {
      this.signupForm = fb.group({
        username : ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required]],
        email : ['', [Validators.required, Validators.pattern(this.validRule['email'])]]
      })
  }

  submitForm(value: any): void {
    this.http.post('/member/signup',value, { observe: 'response' }).subscribe(res => {
      if(res['status'] == 200 && !res['body']['message']) {
        this.alertMessage ='ok';
        this.resetInput();
        this.loginStatus.saveToken(res['body']['token']);
      }
      else {
        this.alertMessage = res['body']['message'];
      }
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
  }
}
