import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode:boolean=false;
  /*values: any;*/
  constructor(private http: HttpClient,
    private authService: AuthService,
        private route: Router) { }

  ngOnInit() {
    /*this.getValues();*/
if (this.authService.logedIn){
  this.route.navigate(["/members"]);
}
  }
  registerToggle(){
    this.registerMode=!this.registerMode
  }
  /*getValues() {
    this.http.get('http://localhost:5000/api/values').subscribe (
      Response => {this.values = Response ; },
         error => {console.log(error); }
        );
  } */
  cancelRegister(mode:boolean)
  {
    this.registerMode=mode;
  }
}
