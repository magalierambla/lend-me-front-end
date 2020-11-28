import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

declare var navigator: any;

@Component({
  selector: 'app-nav-bar-accueil',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarAccueilComponent implements OnInit {

  public userLang: any;

  public keyword = '';

  constructor(private router: Router, private route: ActivatedRoute, public translate: TranslateService, private cookie: CookieService) {

    translate.addLangs(['en', 'fr', 'es']);

    if (this.cookie.get('lang_translat_user')) {

      const langTranslat = this.cookie.get('lang_translat_user');

      translate.setDefaultLang(langTranslat);


    }else{

      this.userLang = navigator.language || navigator.userLanguage;

      translate.setDefaultLang(this.userLang);

    }
  }

  switchLang(lang: string) {

    this.translate.use(lang);

    this.cookie.set('lang_translat_user', lang);
  }

  ngOnInit(): void {  }

  searchProjectsByMotCle(){

     this.router.navigate(['/search_projects'], {queryParams : {keyword: this.keyword}});


  }

}
