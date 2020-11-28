import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from 'src/app/interfaces/models';

@Component({
  selector: 'app-nav-admin-templates',
  templateUrl: './nav-templates.component.html',
  styleUrls: ['./nav-templates.component.css']
})
export class NavTemplatesAdministratorComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

 public urlImageProfil: string;

 public tagSearchGlobal = '' ;


constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private cookie: CookieService) {

  this.infosUser = JSON.parse(this.cookie.get('infosUser'));

  if (this.infosUser.photoUser === ''){

    if (this.infosUser.sex === 'F') {

      this.infosUser.photoUser = './assets/img/users/user_f.png';

      this.urlImageProfil = './assets/img/users/user_f.png';
    }

    if (this.infosUser.sex === 'H') {

      this.infosUser.photoUser = './assets/img/users/user_m.png';

      this.urlImageProfil = './assets/img/users/user_m.png';
      }

  }else{

    this.urlImageProfil = this.infosUser.photoUser;

  }

  
 }

ngOnInit(): void {

  this.loadStyle('assets/vendor/fontawesome-free/css/all.min.css');

  this.loadStyle('assets/vendor/bootstrap/css/bootstrap.min.css');

  this.loadStyle('assets/css/sb-admin-2.css');

 // this.loadJs('assets/vendor/jquery/jquery.min.js');

 // this.loadJs('assets/vendor/bootstrap/js/bootstrap.bundle.min.js');

 // this.loadJs('assets/vendor/jquery-easing/jquery.easing.min.js');

 // this.loadJs('assets/js/sb-admin-2.min.js');

 }

searchGlobalProjectsByMotCle(){

  this.router.navigate(['/admin-search-projetcs-by-tag', {search: this.tagSearchGlobal}]);

}

loadStyle(styleName: string) {
  const head = this.document.getElementsByTagName('head')[0];

  const themeLink = this.document.getElementById('client-theme-css') as HTMLLinkElement;

  if (themeLink) {
    themeLink.href = styleName;
  } else {
    const style = this.document.createElement('link');
    style.id = 'client-theme-css';
    style.rel = 'stylesheet';
    style.href = `${styleName}`;

    head.appendChild(style);
  }
}

loadJs(jsName: string) {
  const head = this.document.getElementsByTagName('head')[0];

  const themeLink = this.document.getElementById('client-theme-js') as HTMLLinkElement;

  if (themeLink) {
    themeLink.href = jsName;

  } else {
    const script = this.document.createElement('script');
    script.id = 'client-theme-js';
    script.src = `${jsName}`;

    head.appendChild(script);
  }
}

}
