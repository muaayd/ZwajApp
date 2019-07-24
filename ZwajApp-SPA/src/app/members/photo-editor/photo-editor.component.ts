import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Photo } from "src/app/_models/photo";
import { FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/_services/auth.service";
// import { join } from "path";
import { UserService } from "src/app/_services/user.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { User } from "src/app/_models/user";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-photo-editor",
  templateUrl: "./photo-editor.component.html",
  styleUrls: ["./photo-editor.component.css"]
})
export class PhotoEditorComponent implements OnInit {
  @Input() Photos: Photo[];
  @Output() getMainPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  currentMain: Photo;
  user: User;
  PhotoUrl: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      PhotoUrl => (this.PhotoUrl = PhotoUrl)
    );
    this.initializeUploader();
    // this.route.data.subscribe(data => {
    //   this.user = data["user"];
    // });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "users/" +
        this.authService.decodedToken.nameid +
        "/photos",
      authToken: "Bearer  " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 //10 maga
    });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, Response, status, Headers) => {
      if (Response) {
        const res: Photo = JSON.parse(Response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          isMain: res.isMain
        };
        this.Photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.Photos.filter(p => p.isMain === true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          //this.user.photoURL=photo.url
          //this.getMainPhotoChange.emit(photo.url);
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoURL = photo.url;
          localStorage.setItem(
            "user",
            JSON.stringify(this.authService.currentUser)
          );
        },
        () => {
          this.alertifyService.error("يوجد مشكلة في الصورة الاساسية");
        }
      );
  }
  delete(id: number) {
    this.alertifyService.confirm("هل تريد حذف الصورة", () => {
      this.userService
        .deletePoto(this.authService.decodedToken.nameid, id)
        .subscribe(
          () => {
            this.Photos.splice(this.Photos.findIndex(p => p.id === id), 1);
              this.alertifyService.success('تم حذف الصورة');
          },
        error=>{this.alertifyService.success('حدث خطاء اثناء حذف الصورة');}
        
        );
    });
  }
}
