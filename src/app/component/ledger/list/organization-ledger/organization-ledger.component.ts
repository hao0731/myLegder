import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';

@Component({
  selector: 'organization-ledger',
  templateUrl: './organization-ledger.component.html',
  styleUrls: ['./organization-ledger.component.css']
})
export class OrganizationLedgerComponent implements OnInit {
  ledgers:any = [];
  deleteLedgerId:String = 'default';
  constructor(private http: HttpClient, private router: Router, private loginStatus: LoginStatusService) { }

  getDeleteLedgerId(id:String) {
    this.deleteLedgerId = id;
  }

  deleteLedger() {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.delete('/api/ledgers/'+this.deleteLedgerId, {observe:'response', headers: headers}).subscribe(res => {
      this.ledgers = this.ledgers.filter(elem => {return elem['_id'].toString() !== this.deleteLedgerId});
    },(err:HttpErrorResponse) => {
      console.log(err);
    });
  }
  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.get('/api/organization', {observe:'response', headers: headers}).subscribe(res => {
      this.ledgers = res['body']['data'];
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });
  }

}
