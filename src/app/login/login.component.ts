import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor() {}

  onLogin(form: NgForm) {
    if (form.valid) {
      console.log('Login Data:', this.loginData);
      // You can call your login API here
    } else {
      console.log('Form is invalid.');
    }
  }
}


