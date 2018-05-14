import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { PersonalLedgerComponent } from './component/ledger/list/personal-ledger/personal-ledger.component';
import { PersonalLedgerDetailComponent } from './component/ledger/detail/personal-ledger-detail/personal-ledger-detail.component';
import { OrganizationLedgerComponent } from './component/ledger/list/organization-ledger/organization-ledger.component';
import { OrganizationLedgerDetailComponent } from './component/ledger/detail/organization-ledger-detail/organization-ledger-detail.component';
import { SigninComponent } from './component/signin/signin.component';
import { SignupComponent } from './component/signup/signup.component';
import { AccountSettingComponent } from './component/account-setting/account-setting.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

const routes: Routes = [
  { path:'', children:[], component: HomeComponent },
  {path:'my/ledgers', children:[
    {path:'', component: PersonalLedgerComponent},
    {path:':id', component: PersonalLedgerDetailComponent}
  ]},
  {path:'organization/ledgers', children:[
    {path:'', component: OrganizationLedgerComponent},
    {path:':id', component: OrganizationLedgerDetailComponent}
  ]},
  { path:'signin', children:[], component: SigninComponent },
  { path:'signup', children:[], component: SignupComponent },
  {path:'settings', children:[], component: AccountSettingComponent},
  { path:'**', children:[], component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
