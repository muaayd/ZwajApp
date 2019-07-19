import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";
import { User } from "../_models/user";
import { Observable, of } from "rxjs";

import { catchError } from "rxjs/operators";
import { AuthService } from "../_services/auth.service";

@Injectable()
export class MemberEditResolver implements Resolve<User>{
    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private authService: AuthService,
        private route:Router){}

     resolve(route:ActivatedRouteSnapshot):Observable<User>{
         

    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
        catchError(error=>{
            this.alertify.error('يوجد مشكلة في عرض البيانات');
            this.route.navigate(['/members']);
            return of(null);

        })
        )
    
     }  
}