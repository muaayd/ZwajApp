import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";
import { User } from "../_models/user";
import { Observable, of } from "rxjs";

import { catchError } from "rxjs/operators";

@Injectable()
export class MemberDetailResolver implements Resolve<User>{
    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private route:Router){}

     resolve(route:ActivatedRouteSnapshot):Observable<User>{
         

    return this.userService.getUser(route.params['id']).pipe(
        catchError(error=>{
            this.alertify.error('يوجد مشكلة في عرض البيانات');
            this.route.navigate(['/members']);
            return of(null);

        })
        )
    
     }  
}