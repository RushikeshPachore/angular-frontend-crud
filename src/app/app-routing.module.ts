import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { RedirectComponent } from './redirect/redirect.component';
import { HomeComponent } from './employee-detail/home/home.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'',redirectTo:'login', pathMatch:'full'}, //by default syntax , that it will go there first
  {path:'employee-details',component:EmployeeDetailComponent},
  {path:'redirect',component:RedirectComponent},
  {path:'home',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
