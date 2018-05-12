import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { SigninComponent } from './component/signin/signin.component';
import { SignupComponent } from './component/signup/signup.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { LoginStatusService } from './service/token/login-status.service';
import { DealLoginStatusService } from './service/token/deal-login-status.service';
import { InitialLoginStatus } from './interface/login-status/initial-login-status';
import { ChangeLoginStatus } from './component/signin/interface/change-login-status';
import { AccountSettingComponent } from './component/account-setting/account-setting.component';
import { DisableControlDirective } from './directive/disable-control.directive';
import { PersonalLedgerComponent } from './component/ledger/list/personal-ledger/personal-ledger.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    NotFoundComponent,
    AccountSettingComponent,
    DisableControlDirective,
    PersonalLedgerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    LoginStatusService,
    DealLoginStatusService,
    { provide:InitialLoginStatus, useExisting: DealLoginStatusService },
    { provide:ChangeLoginStatus, useExisting: DealLoginStatusService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
