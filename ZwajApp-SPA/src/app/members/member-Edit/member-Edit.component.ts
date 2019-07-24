import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { UserService } from "src/app/_services/user.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/_models/user";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/_services/auth.service";

@Component({
  selector: "app-member-Edit",
  templateUrl: "./member-Edit.component.html",
  styleUrls: ["./member-Edit.component.css"]
})
export class MemberEditComponent implements OnInit {
  @ViewChild("editForm") editForm: NgForm;
  user: User;
  PhotoUrl: string;
  @HostListener("window:beforeunload", ["$event"])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private AuthService: AuthService,
  ) {}

  ngOnInit() {
    this.AuthService.currentPhotoUrl.subscribe(PhotoUrl => this.PhotoUrl=PhotoUrl);
 
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
  }
  updateuser() {
 
    console.log(this.user);
   
    
    this.userService.UpdateUser(this.AuthService.decodedToken.nameid,this.user).
    subscribe(
      ()=>{
        this.alertify.success("تم تعديل الملف الشخصي");
        this.editForm.reset(this.user);
      },
      error=>this.alertify.error(error))
 
 
  }
  updateMainPhoto(photoUrl){
    this.user.photoURL=photoUrl
    //this.AuthService.changeMemberPhoto(this.AuthService.currentUser.photoURL);
  }
}
