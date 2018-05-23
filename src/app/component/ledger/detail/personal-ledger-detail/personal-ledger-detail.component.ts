import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';
import { CaculateTotalInterface } from '../interface/caculate-total';
 
@Component({
  selector: 'app-personal-ledger-detail',
  templateUrl: './personal-ledger-detail.component.html',
  styleUrls: ['./personal-ledger-detail.component.css']
})
export class PersonalLedgerDetailComponent implements OnInit {
  ledgerId: String;
  ledger: any = undefined;
  ledgerDetail:any = [];
  total:any = [0,0,0];
  accountForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route:ActivatedRoute, private loginStatus: LoginStatusService, private caculateTotal: CaculateTotalInterface) { 
    this.accountForm = fb.group({
      accountName : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      accountClass : ['食', [Validators.required]],
      accountPrice : ['', [Validators.required, Validators.pattern(/^[\d]+$/)]],
      accountDate : ['', [Validators.required]]
    })
  }

  submitForm(value:any) {
    value.ledgerId = this.ledgerId;
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.post('/api/ledgers/details/'+this.ledgerId, value,{observe:'response', headers: headers}).subscribe(res => {
      console.log(res);
    },(err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
    this.route.params.subscribe(params => this.ledgerId = params['id'])
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.get('/api/ledgers/'+ this.ledgerId, {observe:'response', headers: headers}).subscribe(res => {
      console.log(res['body']['data']);
      this.ledger = res['body']['data'];
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });

    this.http.get('/api/ledgers/details/'+ this.ledgerId, {observe:'response', headers: headers}).subscribe(res => {
      console.log(res['body']['data']);
      this.ledgerDetail = res['body']['data'];
      this.total[0] = this.caculateTotal.calcIncome(this.ledgerDetail);
      this.total[1] = this.caculateTotal.calcCost(this.ledgerDetail);
      this.total[2] = this.caculateTotal.calcDesposit(this.ledgerDetail);
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });
  }

}
