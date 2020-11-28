import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {UserModel, InscriptionUserModel, ConnectionUserModel, ResponseConnectionUserModel} from '../interfaces/models';
import Swal from 'sweetalert2/dist/sweetalert2.js';

// https://medium.com/letsboot/lets-pick-a-date-with-ng2-datepicker-1ba2d9593a66

declare var window: any;



@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.css']
})
export class IdentificationComponent implements OnInit {

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  datePickerConfig = {
    drops: 'up',
    format: 'DD-MM-YYYY',
    locale: 'fr',
    addClass: 'form-control',
  };

  public infosUser: UserModel = new UserModel();

  public ObjetLogin: ConnectionUserModel = new ConnectionUserModel();

  public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

  public ObjetInscription: InscriptionUserModel = new InscriptionUserModel();

  public isErreurLogin = false;

  public isErreurInscription = false;

  public isvalidLogin = false;

  public isvalidInscription = false;

  private isvalidCaptcha = false;

  public isErreurCaptcha = false;

  events: string[] = [];



  constructor(private route: ActivatedRoute, private router: Router, private apiService: apiHttpSpringBootService,
              private cookie: CookieService, private datePipe: DatePipe, private ngxService: NgxUiLoaderService,
              private titleService: Title) {

    this.titleService.setTitle('Identification-inscription');

    this.route.params.subscribe(params => {

      if (params.deconnection) {

           // alert(params.deconnection);

           this.Logout();
      }



    });

  }

  ngOnInit(): void {

    /********************************************************* */

   this.addRecaptchaScript();

   const date = new Date();

 /*  this.ObjetInscription.date_created = date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',

    }); */

  }

  addEventDateNaissance(event) {



    const date = new Date();

    if (event >= date) {

      this.isErreurInscription = true;

      this.tinyAlert('La date de naissance doit etre inferiur à la date actuelle !!!');

    } else {

      this.isErreurInscription = false;

      // console.log(this.datePipe.transform(event, 'yyyy-MM-dd'));

      this.ObjetInscription.date_naissance = this.datePipe.transform(event, 'yyyy-MM-dd');

    }


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
        // console.log('response', response);

        this.isvalidCaptcha = true;

        this.isErreurCaptcha = false;
      }
    });
  }

  public onFormSubmitLogin() {

   /* this.cookie.set('infosConnectionUser', JSON.stringify(this.ObjetLogin));

    this.router.navigate(['/captcha-identification']); */

    this.ngxService.start();


    this.apiService.identificationUser(this.ObjetLogin).subscribe((dataUser: ResponseConnectionUserModel) => {

      // console.log('IdentificationComponent/identification', dataUser);

      if (!dataUser) {

        this.isErreurLogin = true;

      } else {

        this.ObjetResponseConnection = dataUser;


        this.cookie.set('ObjetResponseConnection', JSON.stringify(this.ObjetResponseConnection));

       

        this.getDataUserCurrent(this.ObjetResponseConnection);


      }

      this.ngxService.stop();


    }, (error: any) => { });

  }

  public getDataUserCurrent(ObjetResponseConnection: ResponseConnectionUserModel){

       
       this.apiService.getDataUserCurrent(ObjetResponseConnection).subscribe((dataUser: UserModel) => {

        console.log('dataUser=', dataUser);

        this.infosUser = dataUser;

        this.infosUser.typeCompte = 'user';

        this.cookie.set('infosUser', JSON.stringify(this.infosUser));

        this.router.navigate(['/profilUser']);



        }, (error: any) => {

        this.tinyAlert('Une erreur produite dans l\'enregistrement .Merci de relancer l\'inscription.');

      });

  }

  public onFormSubmitInscription() {

    if (this.isvalidCaptcha && !this.isErreurInscription) {

    this.ngxService.start();

    this.apiService.inscriptionUser(this.ObjetInscription).subscribe((dataUser: UserModel) => {

        // console.log('inscriptionUser', dataUser);

        if (!dataUser) {

          this.isErreurInscription = true;

        } else {

             this.tinyAlert('Un email de confirmation à été envoyé dans votre boite email pour valider votre inscription.');


        }


      }, (error: any) => {

            this.tinyAlert('Une erreur produite dans l\'enregistrement .Merci de relancer l\'inscription.');

      });

    this.ngxService.stop();

    }

  }

  Logout(){

     // this.cookie.deleteAll();

    this.cookie.delete('infosUser'); // supression-cookie


  }

  tinyAlert(message: string){

    Swal.fire(message);
}



}
