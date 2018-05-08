import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatusService } from '../../service/token/login-status.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  constructor(private router: Router, private loginStatus: LoginStatusService) { }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
  }

}
