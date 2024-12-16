import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptor } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './employee-detail/employee-form/employee-form.component';
import { FormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RedirectComponent } from './redirect/redirect.component';
import { noSpaceValidator } from './validators';
import { NoSpaceValidatorDirective } from './noSpace.directive';
import { AuthInterceptor } from './shared/AuthInterceptor';
import { HomeComponent } from './employee-detail/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeDetailComponent,
    EmployeeFormComponent,
    LoginComponent,
    RedirectComponent,
    HomeComponent,
    NoSpaceValidatorDirective,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, //for Router Outlet
    HttpClientModule, //for Http
    FormsModule //for NgModule
  ],
  exports:[
  ],
  providers: [DatePipe, {
    provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
