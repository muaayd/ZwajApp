import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwthelper = new JwtHelperService();  
  constructor(public AuthService:AuthService){}
  ngOnInit() {
    const token =localStorage.getItem('token')
    this.AuthService.decodedToken=this.jwthelper.decodeToken(token)
  }

}
