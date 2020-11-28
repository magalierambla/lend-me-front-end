import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieProjectModel, ProjectModel, templteProjectModel } from '../interfaces/models';
import { apiHttpSpringBootService } from '../api-spring-boot.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-search-projects-visitor',
  templateUrl: './search-projects-visitor.component.html',
  styleUrls: ['./search-projects-visitor.component.css']
})
export class SearchProjectsVisitorComponent implements OnInit {

  public tagSearch = '';

  public listProjects: Array<ProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listCategorieProjects: Array<CategorieProjectModel> = [];

  public showAlertResult = false;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: apiHttpSpringBootService,
              private datePipe: DatePipe, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      if (params.getAll('keyword')[0]) {

        console.log(params.getAll('keyword')[0]);

        this.tagSearch = params.getAll('keyword')[0];

        this.searchProjectsByMotCle();

        this.getListCategoriesProjects();
      }

      /* if (params.getAll('test')[0]){
 
         console.log(params.getAll('test')[0]);
       }*/


    });



  }

  getListCategoriesProjects(){


    this.apiService.getListCategorieProject().subscribe((data: any) => {

      // console.log(data);

      if (data){

         this.listCategorieProjects = data;


      }else{

          // alert("pas de projects-1");
      }


     }, (error: any) => {});


  }

  searchProjectsByMotCle() {

    this.showAlertResult = false;

    this.listProjects = [];

    this.listtemplateProjects = [];

    console.log('tagSearch =', this.tagSearch);

    const tagSearch = this.tagSearch;

    this.ngxService.start();

    this.apiService.listAllProjectsFiltreByTagForUser(tagSearch).subscribe((dataProjects: Array<ProjectModel>) => {


      console.log('data-projects-filtre', dataProjects);

      this.listProjects = dataProjects;


      for (let index = 0; index < this.listProjects.length; index++) {


        const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

        objectTemplteProjectModel.project = this.listProjects[index];

        objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

        this.listtemplateProjects.push(objectTemplteProjectModel);


      }

      this.formaterListProject();

      this.ngxService.stop();

    }, (error: any) => {

      this.ngxService.stop();

      this.showAlertResult = true;

    });

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






  formaterListProject() {

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.listProjects.length; index++) {


      /****************************************************************** */

      // tslint:disable-next-line:max-line-length
      this.listtemplateProjects[index].tauxFinance = (this.listProjects[index].total_fonds / this.listProjects[index].montant_minimun) * 100;


      /******************************************************************* */


      if (this.listProjects[index]._statut_project.nom === 'Attente') {


        this.listProjects[index]._statut_project.nom = 'Attente';

      }

      if (this.listProjects[index]._statut_project.nom === 'Valide') {


        this.listProjects[index]._statut_project.nom = 'Validé';

      }

      if (this.listProjects[index]._statut_project.nom === 'Termine') {


        this.listProjects[index]._statut_project.nom = 'Terminé';

      }

      if (this.listProjects[index]._statut_project.nom === 'Annule') {


        this.listProjects[index]._statut_project.nom = 'Annulé';

      }

      if (this.listProjects[index]._statut_project.nom === 'En cours') {


        this.listProjects[index]._statut_project.nom = 'En cours';

      }

      if (this.listProjects[index]._statut_project.nom === 'Renouvele') {


        this.listProjects[index]._statut_project.nom = 'Renouvele';

      }

      /********************************************************** */

      this.listtemplateProjects[index].dateLimiteCollecteFormate = this.datePipe.transform(this.listProjects[index].date_limite_collecte, 'dd-MM-yyyy');


      /********************************************************** */

    }

  }

}
