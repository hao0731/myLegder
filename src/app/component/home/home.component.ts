import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoginStatusService } from '../../service/token/login-status.service';
declare let $:any;

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alertMessage:String = 'loading';
  setType:String = '';
  setLedgerForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginStatus: LoginStatusService) { 
    this.setLedgerForm = fb.group({
      ledgername : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      openAuth: 'close'
    })
  }

  setForm(type:String): void {
    this.setType = type;
  }

  submitForm(value:any): void {
    value.formType = this.setType;
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer '+ this.loginStatus.getToken()
    })
    this.http.post('/api/ledgers', value,{observe:'response', headers: headers}).subscribe(res => {
      this.alertMessage = 'ok';
      $('#setLedgerModal').modal('hide')
      if(this.setType === 'personal') {
        this.router.navigate(['/my/ledgers/'+res['body']['data']]);
      }
      else {
        this.router.navigate(['/organization/ledgers/'+res['body']['data']]);
      }
      
    },(err: HttpErrorResponse) => {
      this.alertMessage = err.error['message'];
    });
  }

  ngOnInit() {
    if(!this.loginStatus.isLogin()) this.router.navigate(['/signin']);
  }

}
