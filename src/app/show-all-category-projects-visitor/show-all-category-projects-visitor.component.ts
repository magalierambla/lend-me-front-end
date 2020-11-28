import { Component, OnInit } from '@angular/core';
import { CategorieProjectModel, ProjectModel, templteProjectModel } from '../interfaces/models';
import { apiHttpSpringBootService } from '../api-spring-boot.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-all-category-projects-visitor',
  templateUrl: './show-all-category-projects-visitor.component.html',
  styleUrls: ['./show-all-category-projects-visitor.component.css']
})
export class ShowAllCategoryProjectsVisitorComponent implements OnInit {

  public listCategory: Array<{categorie: CategorieProjectModel, listProjects: Array<templteProjectModel>}> = [];

  constructor(private router: Router, private route: ActivatedRoute, private apiService: apiHttpSpringBootService,
              private datePipe: DatePipe, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {

       this.getListCategoriesProjects();
   }

  getListCategoriesProjects(){


    this.apiService.getListCategorieProject().subscribe((dataCatgory: any) => {

      // console.log(data);

      if (dataCatgory){

            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < dataCatgory.length; index++) {

              this.listCategory.push({categorie : dataCatgory[index], listProjects : []});

              this.searchProjectsByCategorie(this.listCategory[index]);


            }

      }else{

          // alert("pas de projects-1");
      }


     }, (error: any) => {});


  }

  searchProjectsByCategorie(objectCategory) {

    // this.listProjects = [];

    objectCategory.listProjects = [];

    this.apiService.listAllProjectsByCategoryForVisitor(objectCategory.categorie.nom).subscribe((dataProjects: Array<ProjectModel>) => {

      if (dataProjects) {

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < dataProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = dataProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(dataProjects[index]);

          objectCategory.listProjects.push(objectTemplteProjectModel);

          this.formaterListProject(objectCategory.listProjects[index]);


        }


      }


    }, (error: any) => {


    });



  }


  calculNombredeJours(objectProject) {

    const date1 = new Date();

    const date2 = new Date(objectProject.date_limite_collecte);

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



  formaterListProject(objectTemplateProject: templteProjectModel) {


      /****************************************************************** */

      // tslint:disable-next-line:max-line-length
      objectTemplateProject.tauxFinance = (objectTemplateProject.project.total_fonds / objectTemplateProject.project.montant_minimun) * 100;


      /******************************************************************* */


      if (objectTemplateProject.project._statut_project.nom === 'Attente') {


        objectTemplateProject.project._statut_project.nom = 'Attente';

      }

      if (objectTemplateProject.project._statut_project.nom === 'Valide') {


        objectTemplateProject.project._statut_project.nom = 'Validé';

      }

      if (objectTemplateProject.project._statut_project.nom === 'Termine') {


        objectTemplateProject.project._statut_project.nom = 'Terminé';

      }

      if (objectTemplateProject.project._statut_project.nom === 'Annule') {


        objectTemplateProject.project._statut_project.nom = 'Annulé';

      }

      if (objectTemplateProject.project._statut_project.nom === 'En cours') {


        objectTemplateProject.project._statut_project.nom = 'En cours';

      }

      if (objectTemplateProject.project._statut_project.nom === 'Renouvele') {


        objectTemplateProject.project._statut_project.nom = 'Renouvele';

      }

      /********************************************************** */

      // tslint:disable-next-line:max-line-length
      objectTemplateProject.dateLimiteCollecteFormate = this.datePipe.transform(objectTemplateProject.project.date_limite_collecte, 'dd-MM-yyyy');


      /********************************************************** */





  }


}
