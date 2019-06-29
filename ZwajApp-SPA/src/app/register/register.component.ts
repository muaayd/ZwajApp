import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from '../_services/auth.service';
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
 /* @Input() valuesFromRegister: any;*/
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private AuthService:AuthService) {}

  ngOnInit() {}
  register() {
    /*console.log("تم الاشتراك");*/
    this.AuthService.register(this.model).subscribe
   ( next=>{console.log("تم الاشتراك بنجاح")}, 
     error=>{console.log(error) })
  }
  cancel() {
    console.log("ليس الان");
    this.cancelRegister.emit(false);
  }
}
