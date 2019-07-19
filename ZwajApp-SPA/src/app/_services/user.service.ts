import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/user";
// const httpOption = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.apiUrl + "Users/";
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    //return this.http.get<User[]>(this.baseUrl, httpOption);
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id): Observable<User> {
    //return this.http.get<User>(this.baseUrl + id, httpOption);
    return this.http.get<User>(this.baseUrl + id)
  }
  UpdateUser(id:number,user:User){
    return this.http.put(this.baseUrl+id,user)
  }
}
