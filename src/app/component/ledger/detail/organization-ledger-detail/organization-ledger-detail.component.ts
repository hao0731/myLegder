import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';

@Component({
  selector: 'app-organization-ledger-detail',
  templateUrl: './organization-ledger-detail.component.html',
  styleUrls: ['./organization-ledger-detail.component.css']
})
export class OrganizationLedgerDetailComponent implements OnInit {
  ledgerId: String;
  ledger: any = undefined;
  constructor(private http: HttpClient, private router: Router, private route:ActivatedRoute, private loginStatus: LoginStatusService) { }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
    this.route.params.subscribe(params => this.ledgerId = params['id'])
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.get('/api/ledgers/'+ this.ledgerId, {observe:'response', headers: headers}).subscribe(res => {
      this.ledger = res['body']['data'];
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });
  }

}
