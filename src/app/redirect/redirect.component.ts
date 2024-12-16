import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  userName:string=''
  email:string=''
  token:string=''
  userId:string=''
  image:string=''
  // designation:string=''


  constructor(private route:Router){}
  //getting details using localStorage as we seyt them in login component
  ngOnInit(){ //as we navigated from login.ts after setting up userNmae there etc, now we get it here and set in our local variable userName

    this.userName=localStorage.getItem('userName') || 'Guest';
    this.email=localStorage.getItem('email') || 'Guest'; 
    this.token=localStorage.getItem('token');
    this.userId=localStorage.getItem('userId');

    console.log(this.image);
  }

  //method is called from html file
  logout(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}