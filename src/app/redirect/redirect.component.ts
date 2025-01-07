import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../shared/employee.service';

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
  gender:string=''
  // designation:string=''
  answers: { [key: number]: string } = {}; 

  constructor(public empService: EmployeeService,private route:Router){}
  //getting details using localStorage as we seyt them in login component
  ngOnInit(){ //as we navigated from login.ts after setting up userNmae there etc, now we get it here and set in our local variable userName

    this.userName=localStorage.getItem('userName') || 'Guest';
    this.email=localStorage.getItem('email') || 'Guest'; 
    this.token=localStorage.getItem('token');
    this.userId=localStorage.getItem('userId');
    this.gender=localStorage.getItem('gender');

    this.empService.getQuestion().subscribe(question=>{
      this.empService.listQuestion=question;
      console.log("ques,",this.empService.listQuestion);
    })

    
  }
  
  //method is called from html file
  logout(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}