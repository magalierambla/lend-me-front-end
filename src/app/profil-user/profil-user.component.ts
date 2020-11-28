import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { ImageService } from './../image.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ResponseConnectionUserModel, UserModel, UserUpdateProfilRequest } from '../interfaces/models';


declare var window: any;


@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.css']
})
export class ProfilUserComponent implements OnInit {

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  public infosUser: UserModel = new UserModel();

  public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

  public ObjetUpdateProfil: UserUpdateProfilRequest = new UserUpdateProfilRequest();

  public isErreurUpdateProfil = false;

  public isvalidUpdateProfil = false;

  public imageTitle: string;

  public imageDescription: string;

  public imageFile: File;

  public arrayListSex = [

    { key: 'H', value: 'Homme' },
    { key: 'F', value: 'Femme' }
  ];

  public urlImageProfil = '';

  private isvalidCaptcha = false;

  public isErreurCaptcha = false;

  constructor(private router: Router, private cookie: CookieService, private apiService: apiHttpSpringBootService,
              private titleService: Title, private imageService: ImageService, private ngxService: NgxUiLoaderService) {

    this.titleService.setTitle('profil-utilisateur');




    if (this.cookie.get('infosUser')  &&  this.cookie.get('ObjetResponseConnection')) {

      this.ObjetResponseConnection = JSON.parse(this.cookie.get('ObjetResponseConnection'));

      this.infosUser = JSON.parse(this.cookie.get('infosUser'));

      this.getDataProfilUserCurrent();

  

      // console.log('urlImageProfil', this.urlImageProfil);

      // console.log('ProfilUserComponent', this.infosUser);


    } else {

      this.router.navigate(['/Identification']);
    }


  }

  ngOnInit(): void {

    this.addRecaptchaScript();

    const date = new Date();

   /* this.ObjetUpdateProfil.date_update = date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',

    }); */

  }

  addRecaptchaScript() {

    window.grecaptchaCallback = () => {
      this.renderReCaptcha();
    };

    (function(d, s, id, obj) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptcha(); return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

  renderReCaptcha() {
    window.grecaptcha.render(this.recaptchaElement.nativeElement, {
      sitekey: '6Lf4I6gZAAAAAMp1E9YI1FJghdQ20CNRtAV9d55y',
      callback: (response) => {
        console.log('response', response);

        this.isvalidCaptcha = true;

        this.isErreurCaptcha = false;
      }
    });
  }

  getDataProfilUserCurrent(){

    this.ngxService.start();

    this.apiService.getDataUserCurrent(this.ObjetResponseConnection).subscribe((dataUser: any) => {

       console.log(dataUser);

       this.ObjetUpdateProfil.email = dataUser.email;

       this.ObjetUpdateProfil.name = dataUser.name;

       this.ObjetUpdateProfil.prenom = dataUser.prenom;

       this.ObjetUpdateProfil.photo_user = dataUser.photoUser;

       this.ObjetUpdateProfil.sex = dataUser.sex;

       this.ObjetUpdateProfil.username = dataUser.username;

       this.ObjetUpdateProfil.password = '';

       if (dataUser.photoUser === '' || !dataUser.photoUser) {

        if (this.infosUser.sex === 'F') {

          this.infosUser.photoUser = './assets/img/users/user_f.png';

          this.urlImageProfil = './assets/img/users/user_f.png';
        }

        if (this.infosUser.sex === 'H') {

          this.infosUser.photoUser = './assets/img/users/user_m.png';

          this.urlImageProfil = './assets/img/users/user_m.png';
        }

      } else {

        this.urlImageProfil = dataUser.photoUser;

      }

       this.ngxService.stop();


    }, (error: any) => {
      this.ngxService.stop();

    });

   

  }

  onFormSubmitUpdateProfil() {


    if (this.isvalidCaptcha) {

      this.ngxService.start();


      this.apiService.updateProfilUser(this.ObjetResponseConnection, this.ObjetUpdateProfil).subscribe((data: any) => {

        // console.log(data);

        if (!data) {

          this.isErreurUpdateProfil = true;

        } else {

          this.isvalidUpdateProfil = true;

        }

        this.isErreurCaptcha = false;


      }, (error: any) => {

        this.isErreurUpdateProfil = true;

      });



      this.ngxService.stop();

    } else {

      this.isErreurCaptcha = true;
    }

  }

  imageInputChange(imageInput: any) {

    this.imageFile = imageInput.files[0];

  }

  addImage() {

    this.ngxService.start();

    const infoObject = {
      title: this.infosUser.name + '_avatar',
      description: this.infosUser.name + '_avatar'
    };

    this.imageService.uploadImage(this.imageFile, infoObject).then((imageData: any) => {

      // console.log(imageData.data.link);

      this.urlImageProfil = imageData.data.link;

      this.ObjetUpdateProfil.photo_user = imageData.data.link;

      this.ngxService.stop();




    });

  }

}
