import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginData = {
    email: '',
    password: ''
  };

  loginUrl: string = 'http://localhost:5213/api/Auth/Login';

  constructor(private http:HttpClient,private router:Router) {}

  
  onLogin(form: NgForm) {
    debugger;
    if (form.valid) {
      // console.log('Login Data:', this.loginData);
      this.http.post(this.loginUrl,this.loginData).subscribe({
        next:(response:any)=>{
          console.log('login response',response)
          // localStorage is a feature of the Web Storage API that allows you to store key-value pairs in a web browser
          if(response.success){  //in this response.userName, "userName" should be same written in backend api,then only it will work
          localStorage.setItem('userName',response.user.name);
          localStorage.setItem('token',response.token);
          localStorage.setItem('email',response.user.email);
          localStorage.setItem('userId',response.user.id);
          localStorage.setItem('gender',response.user.gender);
          // console.log("quesId",response.token);
          this.router.navigate(['/redirect']);
          }

          else{ //error() method prvided by console object
            console.error('Login Failed');
            alert('Invalid email or password, try again');
          }
        },
        error:(error)=>{
          console.error('login error',error);
          alert('Invalid Email or password');
        }
      });
    } else{
      console.log("form is invalid");
      alert('please enter valid credentials');
    }
  }
}

