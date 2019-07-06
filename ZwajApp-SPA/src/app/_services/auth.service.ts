import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: "root"
})
export class AuthService {
  jwthelper = new JwtHelperService();  
  baseUrl = "http://localhost:5000/api/Auth/";
   decodedToken:any;
  constructor(private http: HttpClient) {}
  
  login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((Response: any) => {
        const user = Response;
        if (user) {
          localStorage.setItem("token", user.token);
          this.decodedToken=this.jwthelper.decodeToken(user.token);
          console.log(this.decodedToken);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "register", model)
  }
 
  logedIn()
  {try{
    const token=localStorage.getItem('token');
    return !this.jwthelper.isTokenExpired(token);
  }
    catch{

      return false;
    }
  }


}
