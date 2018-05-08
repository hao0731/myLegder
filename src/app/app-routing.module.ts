import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SigninComponent } from './component/signin/signin.component';
import { SignupComponent } from './component/signup/signup.component';
import { AccountSettingComponent } from './component/account-setting/account-setting.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

const routes: Routes = [
  { path:'', children:[], component: HomeComponent },
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
