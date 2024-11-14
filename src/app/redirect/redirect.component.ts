import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  userName:string=''
  constructor(private route:Router){}

  ngOnInit(){
    this.userName=localStorage.getItem('userName') || 'Guest';
  }

  logout(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}
