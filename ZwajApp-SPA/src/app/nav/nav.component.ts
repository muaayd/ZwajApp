import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model :any={};

  constructor(public AuthService:AuthService,private alertify:AlertifyService) { }
   
  ngOnInit() {
  }

  login() {
   this.AuthService.login(this.model).subscribe
   ( next=>{this.alertify.success("تم الدخول بنجاح")}, 
     error=>{this.alertify.error(error) })
  }
  loggedIn(){

//const token=localStorage.getItem('token');
//return !! token
 return this.AuthService.logedIn();

  }
  loggedOut(){

    const token=localStorage.removeItem('token');
    this.alertify.message("تم الخروج")
    
      }
}
