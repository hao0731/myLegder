import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../service/token/login-status.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  setType:String = '';
  constructor(private router: Router, private loginStatus: LoginStatusService) { }

  setForm(type:String): void {
    this.setType = type;
  }
  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
  }

}
