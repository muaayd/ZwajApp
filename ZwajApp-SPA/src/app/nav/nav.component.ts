import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model :any={};

  constructor(private AuthService:AuthService) { }
   
  ngOnInit() {
  }

  login() {
   this.AuthService.login(this.model).subscribe
   ( next=>{console.log("تم الدخول بنجاح")}, 
     error=>{console.log(error) })
  }
  loggedIn(){

const token=localStorage.getItem('token');
return !! token

  }
  loggedOut(){

    const token=localStorage.removeItem('token');
   console.log('تم الخروج')
    
      }
}
