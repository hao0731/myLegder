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
      res['body']['data']['recorder'] = {username: this.loginStatus.getCurrentUser()['username']};
      console.log(res['body']['data']);
      let newDetail = res['body']['data'];
      this.ledgerDetail.push(newDetail);
      this.setTotal();
    },(err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  setTotal() {
    this.total[0] = this.caculateTotal.calcIncome(this.ledgerDetail);
    this.total[1] = this.caculateTotal.calcCost(this.ledgerDetail);
    this.total[2] = this.caculateTotal.calcDesposit(this.ledgerDetail);
    this.caculateTotal.analysisClass(this.ledgerDetail,(data) => {
      for(let i = 0;i < 7;i++) {
        if(data[i] !== this.classData[i]){
          this.classData[i] = data[i];
          this.BarChart.data.datasets[0].data[i] = this.classData[i];
          this.BarChart.update();
        }
      }
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
      this.ledger = res['body']['data'];
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });

    this.http.get('/api/ledgers/details/'+ this.ledgerId, {observe:'response', headers: headers}).subscribe(res => {
      console.log(res['body']['data']);
      this.ledgerDetail = res['body']['data'];
      this.BarChart = new Chart('barChart', {
        type: 'bar',
        data:{
          labels: ['食','衣','住','行','育','樂','收益'],
          datasets: [{
            label: '金額',
            backgroundColor: '#d83545',
            borderColor: '#d83545',
            data: this.classData
          }]
        },
        options: {
        }
      });
      this.setTotal();
    },(err:HttpErrorResponse)=> {
      console.log(err);
    });
  }

}
