import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model :any={};

  constructor(public AuthService:AuthService,private alertify:AlertifyService,private router:Router) { }
   
  ngOnInit() {
  }

  login() {
   this.AuthService.login(this.model).subscribe
   ( next=>{this.alertify.success("تم الدخول بنجاح")}, 
     error=>{this.alertify.error(error) },
     ()=>{this.router.navigate(['/members']);}
     ) 
  }
  loggedIn(){

//const token=localStorage.getItem('token');
//return !! token
 return this.AuthService.logedIn();

  }
  loggedOut(){

    const token=localStorage.removeItem('token');
    this.alertify.message("تم الخروج");
    this.router.navigate(['']);
      }
}
