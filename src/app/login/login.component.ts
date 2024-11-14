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

  loginUrl: string = 'http://localhost:5213/api/Employees/Login';

  constructor(private http:HttpClient,private router:Router) {}
  onLogin(form: NgForm) {
    if (form.valid) {
      console.log('Login Data:', this.loginData);
      this.http.post(this.loginUrl,this.loginData).subscribe({
        next:(response:any)=>{
          console.log('login response',response)

          alert(response.Message || 'Logged in Successful');
          this.router.navigate(['/employee-details']);

        },
        error:(error)=>{
          console.error('login error',error);
          alert('Invalid email or password');
        }
      });
    } else{
      console.log("form is invalid");
      alert('please enter valid credentials');
    }

  }
}


