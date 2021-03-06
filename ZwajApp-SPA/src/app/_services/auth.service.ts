import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/environments/environment";
import { User } from "../_models/user";
import{BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class AuthService {
  jwthelper = new JwtHelperService();  
  baseUrl = environment.apiUrl+"Auth/";
   decodedToken:any;
   currentUser:User;
   photoUrl= new BehaviorSubject<string>('../../assets/User.png');
   currentPhotoUrl =this.photoUrl.asObservable();

   constructor(private http: HttpClient) {}
  changeMemberPhoto(newPhotoUrl:string){
     this.photoUrl.next(newPhotoUrl);
  }
  login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((Response: any) => {
        const user = Response;
        if (user) {
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken=this.jwthelper.decodeToken(user.token);
          this.currentUser=user.user;
          this.changeMemberPhoto( this.currentUser.photoURL);
          //console.log(this.currentUser);
          //console.log(this.decodedToken);
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
