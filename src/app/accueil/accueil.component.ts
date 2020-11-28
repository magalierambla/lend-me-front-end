import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { CategorieProjectModel, ProjectModel, templteProjectModel, UserModel } from '../interfaces/models';
import { truncatParagraphe } from '../interfaces/functions';
import { CookieService } from 'ngx-cookie-service';

declare var navigator: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  public listProjects: Array<ProjectModel> = [];

  public templateRandomProject: templteProjectModel = new templteProjectModel();

  public randomCategorie = new CategorieProjectModel();

  public listTemplateProjectsPopulaires: Array<templteProjectModel> = [];

  public listTemplateHeartsProjects: Array<templteProjectModel> = [];

  public listTemplateLikesProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  public listCategorieProjects = [];

  public pollingListProject: any;

  public paramObjectUpdate = { action_update: false };

  public userLang: any;



  constructor(private router: Router, private apiService: apiHttpSpringBootService, private titleService: Title
    // tslint:disable-next-line:align
    , private ngxService: NgxUiLoaderService, private datePipe: DatePipe, private cookie: CookieService) {

    this.titleService.setTitle('accueil');

    this.templateRandomProject.setProject(new ProjectModel());

    this.templateRandomProject.getProject().setUserProject(new UserModel());

    this.templateRandomProject.getProject().setCategorieProject(new CategorieProjectModel());

    this.getListCategoriesProjects();

    this.getRandomProject();

    this.getListPopulairesProjects();

    this.getListHeartsProjects();

    this.getListLikesProjects();

  }

  ngOnInit(): void {


    this.userLang = navigator.language || navigator.userLanguage;
    // alert('this.userLang = ' + this.userLang );
  }


  getRandomProject() {

    this.apiService.getRandomProject().subscribe((data: ProjectModel) => {

      // console.log(data);

      if (data) {

        this.templateRandomProject.project = data;

        this.templateRandomProject.project.description = truncatParagraphe(this.templateRandomProject.project.description);

        this.randomCategorie.token = this.templateRandomProject.project.categoryProject.token;

        this.randomCategorie.nom = this.templateRandomProject.project.categoryProject.nom;

        // tslint:disable-next-line:only-arrow-functions
        const categorie = this.listCategorieProjects.filter(function(categorieProject) {

          return categorieProject.nom === data.categoryProject.nom;
        });

        this.randomCategorie = categorie[0];

        this.templateRandomProject.nbrJours = this.calculNombredeJoursProjectRandom();


        this.templateRandomProject.tauxFinance = (data.total_fonds / data.montant_minimun) * 100;

        console.log('this.templateRandomProject.tauxFinance = ', this.templateRandomProject.tauxFinance);

        console.log('categorie = ', categorie);

      }


    }, (error: any) => { });

  }


  getListPopulairesProjects() {



    this.apiService.listAllProjectsTopConsulteForVisitor().subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          this.listTemplateProjectsPopulaires.push(objectTemplteProjectModel);


        }

        this.listTemplateProjectsPopulaires = this.formaterListProject(this.listTemplateProjectsPopulaires);

        /*  this.pollingListProject = setInterval(() => {

                this.paramObjectUpdate.action_update = true;

                this.getListProjects(this.paramObjectUpdate);

            }, 300 * 1000); */ // 5*60*1000 = 5 minute

      } else {

        // alert("pas de projects-1");
      }


    }, (error: any) => {


    });


  }

  getListHeartsProjects() {


    this.apiService.listAllProjectsHeartsForVisitor().subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          this.listTemplateHeartsProjects.push(objectTemplteProjectModel);


        }

        this.listTemplateHeartsProjects = this.formaterListProject(this.listTemplateHeartsProjects);

        /*  this.pollingListProject = setInterval(() => {

                this.paramObjectUpdate.action_update = true;

                this.getListProjects(this.paramObjectUpdate);

            }, 300 * 1000); */ // 5*60*1000 = 5 minute

      } else {

        // alert("pas de projects-1");
      }


    }, (error: any) => {


    });


  }

  getListLikesProjects() {

    this.apiService.listAllProjectsLikesForVisitor().subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          this.listTemplateLikesProjects.push(objectTemplteProjectModel);


        }

        this.listTemplateLikesProjects = this.formaterListProject(this.listTemplateLikesProjects);

        /*  this.pollingListProject = setInterval(() => {

                this.paramObjectUpdate.action_update = true;

                this.getListProjects(this.paramObjectUpdate);

            }, 300 * 1000); */ // 5*60*1000 = 5 minute

      } else {

        // alert("pas de projects-1");
      }


    }, (error: any) => {


    });


  }

  getListCategoriesProjects() {


    this.apiService.getCustumListCategorieProject().subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listCategorieProjects = data;


      } else {

        // alert("pas de projects-1");
      }


    }, (error: any) => { });


  }

  calculNombredeJoursProjectRandom() {

    const date1 = new Date();

    const date2 = new Date(this.templateRandomProject.project.date_limite_collecte);

    const diff = this.dateDiff(date1, date2);

    return 'J-' + diff.day;

    // this.listProjects[indexProject].nbrJoursRestant = 'J-' + diff.day;

    // tslint:disable-next-line:max-line-length
    //  console.log('Entre le ' + date1.toString() + ' et ' + date2.toString() + ' il y a ' + diff.day + ' jours, ' + diff.hour + ' heures, ' + diff.min + ' minutes et ' + diff.sec + ' secondes');

  }

  calculNombredeJours(indexProject) {

    const date1 = new Date();

    const date2 = new Date(this.listProjects[indexProject].date_limite_collecte);

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



  formaterListProject(listTemplateProjects: Array<templteProjectModel>) {

          /********************************* Top consultation ************************************************* */

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < listTemplateProjects.length; index++) {


      /****************************************************************** */

      // tslint:disable-next-line:max-line-length
      listTemplateProjects[index].tauxFinance = (listTemplateProjects[index].project.total_fonds / listTemplateProjects[index].project.montant_minimun) * 100;


      /******************************************************************* */


      if (listTemplateProjects[index].project._statut_project.nom === 'Attente') {


        listTemplateProjects[index].project._statut_project.nom = 'Attente';

      }

      if (listTemplateProjects[index].project._statut_project.nom === 'Valide') {


        listTemplateProjects[index].project._statut_project.nom = 'Validé';

      }

      if (listTemplateProjects[index].project._statut_project.nom === 'Termine') {


        listTemplateProjects[index].project._statut_project.nom = 'Terminé';

      }

      if (listTemplateProjects[index].project._statut_project.nom === 'Annule') {


        listTemplateProjects[index].project._statut_project.nom = 'Annulé';

      }

      if (listTemplateProjects[index].project._statut_project.nom === 'En cours') {


        listTemplateProjects[index].project._statut_project.nom = 'En cours';

      }

      if (listTemplateProjects[index].project._statut_project.nom === 'Renouvele') {


        listTemplateProjects[index].project._statut_project.nom = 'Renouvele';

      }

      /********************************************************** */

      // tslint:disable-next-line:max-line-length
      listTemplateProjects[index].dateLimiteCollecteFormate = this.datePipe.transform(listTemplateProjects[index].project.date_limite_collecte, 'dd-MM-yyyy');


      /********************************************************** */


    }

    return listTemplateProjects;


  }

}
