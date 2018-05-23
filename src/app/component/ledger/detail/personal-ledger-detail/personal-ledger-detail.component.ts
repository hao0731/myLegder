import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';
import { CaculateTotalInterface } from '../interface/caculate-total';
import * as Chart from 'chart.js';
 
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
  //Chart
  BarChart:any;
  classData:any = [0,0,0,0,0,0,0];

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
      this.classData = this.caculateTotal.analysisClass(this.ledgerDetail);
      this.BarChart = new Chart('barChart', {
        type: 'bar',
        data:{
          labels: ['食','衣','住','行','育','樂','收益'],
          datasets: [{
            label: "金額",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: this.classData
          }]
        },
        options: {
        }
      });
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });
  }

}
