import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../../../service/token/login-status.service';
import { CaculateTotalInterface } from '../interface/caculate-total';
import * as Chart from 'chart.js';

@Component({
  selector: 'organization-ledger-detail',
  templateUrl: './organization-ledger-detail.component.html',
  styleUrls: ['./organization-ledger-detail.component.css']
})
export class OrganizationLedgerDetailComponent implements OnInit {
  localUser:String = this.loginStatus.getCurrentUser()['username'];
  isAdmin: Boolean = false;
  ledgerId: String;
  ledger: any = undefined;
  ledgerDetail:any = [];
  total:any = [0,0,0];
  //Chart
  BarChart:any;
  classData:any = [0,0,0,0,0,0,0];

  newMemberName:String = '';
  alertMessage:String = '';

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

  addMember() {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.post('/api/ledgers/'+this.ledgerId+'/members/'+this.newMemberName, {name: this.newMemberName},{observe:'response', headers: headers}).subscribe(res => {
      this.alertMessage = '';
      this.ledger.members.push(res['body']['data']);
    },(err: HttpErrorResponse) => {
      this.alertMessage = err['error']['message'];
      console.log(err);
    });
  }

  controlMemberLevel(id:any,condition:String) {
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    switch(condition) {
      case 'down':
        this.http.put('/api/ledgers/'+this.ledgerId+'/members/'+ id, {condition: 'levelDown'},{observe:'response', headers: headers}).subscribe(res => {
          this.alertMessage = '';
          this.ledger.admins = this.ledger.admins.filter(elem => {return elem._id !== res['body']['data']['_id']});
          this.ledger.members.push(res['body']['data']);
        },(err: HttpErrorResponse) => {
          this.alertMessage = err['error']['message'];
          console.log(err['error']['message']);
        });
        break;
      case 'up':
        this.http.put('/api/ledgers/'+this.ledgerId+'/members/'+ id, {condition: 'levelUp'},{observe:'response', headers: headers}).subscribe(res => {
          this.alertMessage = '';
          this.ledger.members = this.ledger.members.filter(elem => {return elem._id !== res['body']['data']['_id']});
          this.ledger.admins.push(res['body']['data']);
        },(err: HttpErrorResponse) => {
          this.alertMessage = err['error']['message'];
          console.log(err['error']['message']);
        });
        break;
      case 'remove':
        this.http.put('/api/ledgers/'+this.ledgerId+'/members/'+ id, {condition: 'removeMember'},{observe:'response', headers: headers}).subscribe(res => {
          this.alertMessage = '';
          this.ledger.admins = this.ledger.admins.filter(elem => {return elem._id !== res['body']['data']['_id']});
          this.ledger.members = this.ledger.members.filter(elem => {return elem._id !== res['body']['data']['_id']});
        },(err: HttpErrorResponse) => {
          this.alertMessage = err['error']['message'];
          console.log(err['error']['message']);
        });
        break;
      default:
      //dp nothing
    }
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
      if(this.ledger['admins'].filter(elem => {return this.loginStatus.getCurrentUser()['username'] === elem['username']}).length) this.isAdmin = true;
      for(let i = 0;i < this.ledger['admins'].length;i++) {
        for(let j = 0;j < this.ledger['members'].length;j++) {
          if(this.ledger['admins'][i]['username'] === this.ledger['members'][j]['username']) {
            this.ledger['members'].splice(j,1);
            break;
          }
        }
      }
    },(err:HttpErrorResponse)=> {
      if(err['error']['message'] === 'This request is not authorized.') this.router.navigate(['/']);
      console.log(err);
    });

    this.http.get('/api/ledgers/details/'+ this.ledgerId, {observe:'response', headers: headers}).subscribe(res => {
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
