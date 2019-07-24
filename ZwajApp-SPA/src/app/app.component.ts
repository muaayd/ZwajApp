import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "./_services/auth.service";
import { User } from "./_models/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  jwthelper = new JwtHelperService();
  constructor(public AuthService: AuthService) {}
  ngOnInit() {
    const token = localStorage.getItem('token');
   
    if (token) {
      this.AuthService.decodedToken = this.jwthelper.decodeToken(token);
    }
    const user: User = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      this.AuthService.currentUser = user;
      this.AuthService.changeMemberPhoto(this.AuthService.currentUser.photoURL);
    }
  }
}
