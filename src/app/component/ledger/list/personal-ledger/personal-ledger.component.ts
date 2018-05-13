import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';

@Component({
  selector: 'my-ledgers',
  templateUrl: './personal-ledger.component.html',
  styleUrls: ['./personal-ledger.component.css']
})
export class PersonalLedgerComponent implements OnInit {

  constructor(private router: Router, private loginStatus: LoginStatusService) { }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
  }

}