import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ProjectModel, templteProjectModel,
  ImageProjectModel, AdressReseauxSociauxProjectModel, CommentProjectModel,
   InvestiteurProjectModel, UserModel, CategorieProjectModel, NewsProjectModel
} from '../interfaces/models';

@Component({
  selector: 'app-visitor-show-project',
  templateUrl: './visitor-show-project.component.html',
  styleUrls: ['./visitor-show-project.component.css']
})
export class VisitorShowProjectComponent implements OnInit {


  public ObjetProject: ProjectModel = new ProjectModel();

  public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public imagesProjects: Array<ImageProjectModel> = [];

  public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

  public listCommentsForProject: Array<CommentProjectModel> = [];

  public polling: any;

  public pollingComment: any;

  public ObjetDemandeInvest: InvestiteurProjectModel = new InvestiteurProjectModel();

  public listNewsProject: Array<NewsProjectModel> = [];

  constructor(private route: ActivatedRoute, private cookie: CookieService, private apiService: apiHttpSpringBootService
    ,         private ngxService: NgxUiLoaderService, private datePipe: DatePipe, public sanitizer: DomSanitizer) {


    this.route.params.subscribe(params => {

      this.ObjetProject.setUserProject(new UserModel());

      this.ObjetProject.setCategorieProject(new CategorieProjectModel());

      this.ObjetProjectTemplate.setProject(this.ObjetProject);

      this.getinfosProject(params.token);


    });
  }

  ngOnInit(): void { }

  getinfosProject(tokenProject) {

    this.ngxService.start();

    this.apiService.getDataProjectForVisitor(tokenProject).subscribe((dataPorject: ProjectModel) => {

      console.log('dataPorject = ', dataPorject);

      this.ObjetProjectTemplate.project = dataPorject;

      if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0) {

        this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

      }

      if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0) {

        // tslint:disable-next-line:max-line-length
        this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4);
      }

      // tslint:disable-next-line:max-line-length
      /**
       *    dd-MM-yyyy
           'short': equivalent to 'M/d/yy, h:mm a' (6/15/15, 9:03 AM).
           'medium': equivalent to 'MMM d, y, h:mm:ss a' (Jun 15, 2015, 9:03:01 AM).
           'long': equivalent to 'MMMM d, y, h:mm:ss a z' (June 15, 2015 at 9:03:01 AM GMT+1).
           'full': equivalent to 'EEEE, MMMM d, y, h:mm:ss a zzzz' (Monday, June 15, 2015 at 9:03:01 AM GMT+01:00).
          'shortDate': equivalent to 'M/d/yy' (6/15/15).
          'mediumDate': equivalent to 'MMM d, y' (Jun 15, 2015).
          'longDate': equivalent to 'MMMM d, y' (June 15, 2015).
          'fullDate': equivalent to 'EEEE, MMMM d, y' (Monday, June 15, 2015).
          'shortTime': equivalent to 'h:mm a' (9:03 AM).
          'mediumTime': equivalent to 'h:mm:ss a' (9:03:01 AM).
          'longTime': equivalent to 'h:mm:ss a z' (9:03:01 AM GMT+1).
          'fullTime': equivalent to 'h:mm:ss a zzzz' (9:03:01 AM GMT+01:00).
       */

      // tslint:disable-next-line:max-line-length
      this.ObjetProjectTemplate.dateCreatedFormate = this.datePipe.transform(this.ObjetProjectTemplate.project.created_at, 'MMM d, y');

      this.ObjetProjectTemplate.dateLimiteCollecteFormate = this.datePipe.transform(this.ObjetProjectTemplate.project.date_limite_collecte, 'MMM d, y');

      /*********************************************************** */

      if (this.ObjetProjectTemplate.project._user.photoUser === '' || !this.ObjetProjectTemplate.project._user.photoUser) {

        if (this.ObjetProjectTemplate.project._user.sex === 'F') {

          this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_f.png';

        }

        if (this.ObjetProjectTemplate.project._user.sex === 'H') {

          this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_m.png';

        }

      }

      /********************************************************* */

      if (this.ObjetProjectTemplate.project._links_images.length > 0){

        this.imagesProjects = this.ObjetProjectTemplate.project._links_images;

      }else{

        const   _new_imageProject  = new ImageProjectModel();

        _new_imageProject.link = this.ObjetProjectTemplate.project.afficheProject;  

        this.imagesProjects.push(_new_imageProject);

      }

      this.arrayAdressReseauxSociauxProject = this.ObjetProjectTemplate.project._adress_sociaux_project;

      /******************************************************** */

      this.formaterProject();

      this.ObjetProjectTemplate.nbrJours = this.calculNombredeJours();



      this.formaterListCommentsProject();

      this.formaterListNewsProject();

      /******************************************** */

      this.pollingComment = setInterval(() => {

        // this.formaterListCommentsProject();

      }, 300 * 1000);  // 5 minutes


      /******************************************* */

      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });


  }

  formaterListNewsProject(){


    this.listNewsProject = [];

  

     // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.ObjetProjectTemplate.project._news_project.length; index++) {

      // tslint:disable-next-line:max-line-length
      this.ObjetProjectTemplate.project._news_project[index].description = this.ObjetProjectTemplate.project._news_project[index].description.substr(3);

      // tslint:disable-next-line:max-line-length
      this.ObjetProjectTemplate.project._news_project[index].description = this.ObjetProjectTemplate.project._news_project[index].description.substr(0, this.ObjetProjectTemplate.project._news_project[index].description.length - 4);

      this.listNewsProject.push(this.ObjetProjectTemplate.project._news_project[index]);
   }

    this.listNewsProject = this.listNewsProject.sort((c1, c2) => c2.timestamp - c1.timestamp);
   

 }

 formaterListCommentsProject() {

  this.listCommentsForProject = [];

  

  /*************************************************************************************** */

    // tslint:disable-next-line:prefer-for-of
  for (let index = 0; index < this.ObjetProjectTemplate.project._comments.length; index++) {



      // tslint:disable-next-line:max-line-length
      if (this.ObjetProjectTemplate.project._comments[index].user.photoUser === '' || !this.ObjetProjectTemplate.project._comments[index].user.photoUser) {

        if (this.ObjetProjectTemplate.project._comments[index].user.sex === 'F') {

          this.ObjetProjectTemplate.project._comments[index].user.photoUser = './assets/img/users/user_f.png';


        }

        if (this.ObjetProjectTemplate.project._comments[index].user.sex === 'H') {

          this.ObjetProjectTemplate.project._comments[index].user.photoUser = './assets/img/users/user_m.png';


        }

      }

      this.listCommentsForProject.push(this.ObjetProjectTemplate.project._comments[index]);

    }

  console.log('listCommentsForProject', this.listCommentsForProject);

  this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);

  this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);

}


  formaterProject() {


    /****************************************************************** */

    // tslint:disable-next-line:max-line-length
    this.ObjetProjectTemplate.tauxFinance = (this.ObjetProjectTemplate.project.total_fonds / this.ObjetProjectTemplate.project.montant_minimun) * 100;


    /******************************************************************* */


    if (this.ObjetProjectTemplate.project._statut_project.nom === 'Attente') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'Attente';

    }

    if (this.ObjetProjectTemplate.project._statut_project.nom === 'Valide') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'Validé';

    }

    if (this.ObjetProjectTemplate.project._statut_project.nom === 'Termine') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'Terminé';

    }

    if (this.ObjetProjectTemplate.project._statut_project.nom === 'Annule') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'Annulé';

    }

    if (this.ObjetProjectTemplate.project._statut_project.nom === 'En cours') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'En cours';

    }

    if (this.ObjetProjectTemplate.project._statut_project.nom === 'Renouvele') {


      this.ObjetProjectTemplate.project._statut_project.nom = 'Renouvele';

    }

    /********************************************************** */

    // this.listtemplateProjects[index].dateLimiteCollecteFormate = this.datePipe.transform(this.listProjects[index].date_limite_collecte, 'dd-MM-yyyy');


    /********************************************************** */

  }

  calculNombredeJours() {

    const date1 = new Date();

    const date2 = new Date(this.ObjetProjectTemplate.project.date_limite_collecte);

    const diff = this.dateDiff(date1, date2);

    return 'J-' + diff.day;

    // this.listProjects[indexProject].nbrJoursRestant = 'J-' + diff.day;

    // tslint:disable-next-line:max-line-length
    //  console.log('Entre le ' + date1.toString() + ' et ' + date2.toString() + ' il y a ' + diff.day + ' jours, ' + diff.hour + ' heures, ' + diff.min + ' minutes et ' + diff.sec + ' secondes');

  }

  dateDiff(date1, date2) {

    const diff = { day: 0, hour: 0, min: 0, sec: 0 };                           // Initialisation du retour
    let tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    console.log('diff', diff);

    return diff;
  }

}
