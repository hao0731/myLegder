import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';

@Component({
  selector: 'my-ledgers',
  templateUrl: './personal-ledger.component.html',
  styleUrls: ['./personal-ledger.component.css']
})
export class PersonalLedgerComponent implements OnInit {
  ledgers:any = [];
  constructor(private http: HttpClient, private router: Router, private loginStatus: LoginStatusService) { }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.get('/api/ledgers/personal', {observe:'response', headers: headers}).subscribe(res => {
      this.ledgers = res['body']['data'];
    },(err:HttpErrorResponse) => {
      console.log(err);
    });
  }

}
