import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel, ProjectModel, templteProjectModel, FavorisProjectUserModel,
         StatutProjectModel, PorteProjectModel, CategorieProjectModel, HeartProjectUserModel, ResponseConnectionUserModel} from '../interfaces/models';



@Component({
  selector: 'app-list-projects-by-filtre-by-tag-user',
  templateUrl: './list-projects-by-filtre-by-tag-user.component.html',
  styleUrls: ['./list-projects-by-filtre-by-tag-user.component.css']
})
export class ListProjectsByFiltreByTagUserComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

  public listProjects: Array<ProjectModel> = [];

  public listProjectsTemp: Array<ProjectModel> = [];

  public listtemplateProjects: Array<templteProjectModel> = [];

  public listDiffrenceJours = [];

  public objectFavorisProject: FavorisProjectUserModel = new FavorisProjectUserModel();

  public objectHeartProject: HeartProjectUserModel = new HeartProjectUserModel();

  public listPorteProject: Array<PorteProjectModel> = [];

  public listCategorieProject: Array<CategorieProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public tagSearch = '';

  public showAlertResult = false;

  public typeStatutProject = '';

  public typePorteProject = '';

  public typeCategoryProject = '';

  constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService
                  // tslint:disable-next-line:align
              , private ngxService: NgxUiLoaderService, private datePipe: DatePipe) {

    if (this.cookie.get('infosUser')  &&  this.cookie.get('ObjetResponseConnection')) {

      this.infosUser = JSON.parse(this.cookie.get('infosUser'));

      this.ObjetResponseConnection = JSON.parse(this.cookie.get('ObjetResponseConnection'));

      if (this.infosUser.photoUser === '' || !this.infosUser.photoUser) {

        if (this.infosUser.sex === 'F') {

          this.infosUser.photoUser = './assets/img/users/user_f.png';


        }

        if (this.infosUser.sex === 'H') {

          this.infosUser.photoUser = './assets/img/users/user_m.png';


        }

      }

      this.getListPorteProject();

      this.getListCategorieProject();

      this.getListStatutProject();

      console.log('ProfilUserComponent', this.infosUser);


    } else {
      this.router.navigate(['/Identification']);

    }



  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      if (params.getAll('search')[0]) {

        console.log(params.getAll('search')[0]);

        this.tagSearch = params.getAll('search')[0];

        this.searchProjectsByMotCle();
      }

    });

   }

   searchProjectsByMotCle(){

    console.log(this.listProjects.length);

    this.showAlertResult = false;

    this.listProjects = [];

    console.log('tagSearch =', this.tagSearch);

    const tagSearch = this.tagSearch;

    this.ngxService.start();

    this.apiService.listAllProjectsFiltreByTagForUser(tagSearch).subscribe((dataProjects: Array<ProjectModel>) => {

      if (dataProjects.length > 0){

        console.log('data-projects-filtre', dataProjects);

        this.listProjectsTemp = dataProjects ;

        this.listProjects = dataProjects ;

        const paramAction = {update : false};

        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          objectTemplteProjectModel.heartUser = './assets/img/heart-icon-bis.png';

          this.checkFavorisProject(index);

          this.checkHeartsProject(index, paramAction);

          this.listtemplateProjects.push(objectTemplteProjectModel);


        }

        this.formaterListProject();


      }else{

        this.showAlertResult = true;
      }



      this.ngxService.stop();

    }, (error: any) => {

       this.ngxService.stop();

       this.showAlertResult = true;

      });

}


onChangePorteProject(index){

  this.listProjects = this.listProjectsTemp;



      /*************************************************************** */

  if (index !== ''){

    console.log(this.listProjects);

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

     // console.log('item._porte_project.nom =' + item._porte_project.nom);

      return item._porte_project.nom === this.listPorteProject[index].nom;

   });


  }

    /*************************************************************** */



  if (this.typeCategoryProject !== ''){

    const indexCategory = this.typeCategoryProject;

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

      return item.categoryProject.nom === this.listCategorieProject[indexCategory].nom;

   });

  }
   /*************************************************************** */

  if (this.typeStatutProject !== ''){

        let statusProject = '';

        if (this.listeStatusProject[this.typeStatutProject].nom === 'Attente') {


          statusProject = 'Attente';

        }

        if (this.listeStatusProject[this.typeStatutProject].nom === 'Valide') {


          statusProject = 'Validé';

        }

        if (this.listeStatusProject[this.typeStatutProject].nom === 'Termine') {


          statusProject = 'Terminé';

        }

        if (this.listeStatusProject[this.typeStatutProject].nom === 'Annule') {


          statusProject = 'Annulé';

        }

        if (this.listeStatusProject[this.typeStatutProject].nom === 'En cours') {


          statusProject = 'En cours';

        }

        if (this.listeStatusProject[this.typeStatutProject].nom === 'Renouvele') {


          statusProject = 'Renouvele';

        }

        this.listProjects = this.listProjects.filter((item: ProjectModel) => {

          return item._statut_project.nom === statusProject;

       });


      }

         /************************************************************* */
}

onChangeCategorieProject(index){

  this.listProjects = this.listProjectsTemp;


  /*************************************************************** */

  if (index !== ''){

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

      return item.categoryProject.nom === this.listCategorieProject[index].nom;

   });

  }

     /*************************************************************** */

  if (this.typePorteProject !== ''){

    const indexPorte = this.typePorteProject;

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

     return item.categoryProject.nom === this.listCategorieProject[indexPorte].nom;

    });

  }

  /*************************************************************** */

  if (this.typeStatutProject !== ''){

    let statusProject = '';

    if (this.listeStatusProject[this.typeStatutProject].nom === 'Attente') {


      statusProject = 'Attente';

    }

    if (this.listeStatusProject[this.typeStatutProject].nom === 'Valide') {


      statusProject = 'Validé';

    }

    if (this.listeStatusProject[this.typeStatutProject].nom === 'Termine') {


      statusProject = 'Terminé';

    }

    if (this.listeStatusProject[this.typeStatutProject].nom === 'Annule') {


      statusProject = 'Annulé';

    }

    if (this.listeStatusProject[this.typeStatutProject].nom === 'En cours') {


      statusProject = 'En cours';

    }

    if (this.listeStatusProject[this.typeStatutProject].nom === 'Renouvele') {


      statusProject = 'Renouvele';

    }

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

      return item._statut_project.nom === statusProject;

   });


  }

   /************************************************************* */


}



onChangeStatutProject(index){

  this.listProjects = this.listProjectsTemp;


 /*************************************************************** */

  if (index !== ''){

    let statusProject = '';

    if (this.listeStatusProject[index].nom === 'Attente') {


      statusProject = 'Attente';

    }

    if (this.listeStatusProject[index].nom === 'Valide') {


      statusProject = 'Validé';

    }

    if (this.listeStatusProject[index].nom === 'Termine') {


      statusProject = 'Terminé';

    }

    if (this.listeStatusProject[index].nom === 'Annule') {


      statusProject = 'Annulé';

    }

    if (this.listeStatusProject[index].nom === 'En cours') {


      statusProject = 'En cours';

    }

    if (this.listeStatusProject[index].nom === 'Renouvele') {


      statusProject = 'Renouvele';

    }

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

      return item._statut_project.nom === statusProject;

   });

  }

    /*************************************************************** */


  if (this.typeCategoryProject !== ''){

    const indexCategory = this.typeCategoryProject;

    this.listProjects = this.listProjects.filter((item: ProjectModel) => {

      return item.categoryProject.nom === this.listCategorieProject[indexCategory].nom;

   });

 }

 /*************************************************************** */

  if (this.typePorteProject !== ''){

   const indexPorte = this.typePorteProject;

   this.listProjects = this.listProjects.filter((item: ProjectModel) => {

    return item.categoryProject.nom === this.listCategorieProject[indexPorte].nom;

   });

 }

  /*************************************************************** */
}



  getListPorteProject(){

    this.apiService.getListPorteProject().subscribe((data: any) => {

      console.log(data);

      this.listPorteProject = data;


     }, (error: any) => {

    });

  }

  getListCategorieProject(){

    this.apiService.getListCategorieProject().subscribe((data: any) => {

      console.log(data);

      this.listCategorieProject = data;


     }, (error: any) => {

    });

  }

  getListStatutProject() {


    this.apiService.getListStatutProject().subscribe((data: Array<StatutProjectModel>) => {


      console.log('data-ListStatutProject', data);

      this.listeStatusProject = data;

    }, (error: any) => {

    });

  }

  getListAllProjects(objectUser) {

    this.ngxService.start();

    this.apiService.listAllProjectByUser(objectUser).subscribe((data: any) => {

      // console.log(data);

      if (data) {

        this.listProjects = data;

        const paramAction = {update : false};

        for (let index = 0; index < this.listProjects.length; index++) {


          const objectTemplteProjectModel: templteProjectModel = new templteProjectModel();

          objectTemplteProjectModel.project = this.listProjects[index];

          objectTemplteProjectModel.nbrJours = this.calculNombredeJours(index);

          objectTemplteProjectModel.heartUser = './assets/img/heart-icon-bis.png';

          this.checkFavorisProject(index);

          this.checkHeartsProject(index, paramAction);

          this.listtemplateProjects.push(objectTemplteProjectModel);


        }

        this.formaterListProject();



      } else {

        // alert("pas de projects-1");
      }



      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });

  }

checkHeartsProject(indexProject, paramAction){


    // tslint:disable-next-line:max-line-length
    this.apiService.checkHeartProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((dataHeart: any) => {

         if (dataHeart){

          this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon.png';

          if (paramAction.update === true){

            this.deleteHeartProjectForBdd(indexProject);

          }

         }



    }, (error: any) => {

         if (paramAction.update === true){

               this.addHeartProjectForBdd(indexProject);
         }
     });


}

addHeartProject(indexProject, project){

  const paramAction = {update : true};

  this.checkHeartsProject(indexProject, paramAction);

}

addHeartProjectForBdd(indexProject): void{

  console.log('indexProject = ', indexProject);

  this.ngxService.start();

  this.apiService.addHeartProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {


    this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon.png';

    this.updateDataProject(indexProject);

    this.ngxService.stop();

  }, (error: any) => {

    this.ngxService.stop();
  });


}

deleteHeartProjectForBdd(indexProject){

  this.ngxService.start();

  this.apiService.deleteHeartProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {

    this.listtemplateProjects[indexProject].heartUser = './assets/img/heart-icon-bis.png';

    this.updateDataProject(indexProject);

    this.ngxService.stop();

}, (error: any) => {

  this.ngxService.stop();
});


}

addProjectByMyFavoris(indexProject, project){

   this.checkFavorisProjectForBdd(indexProject);


}

updateDataProject(indexProject){


  // tslint:disable-next-line:max-line-length
  this.apiService.getDataProjectForUser(this.ObjetResponseConnection, this.listProjects[indexProject].token, 'user').subscribe((dataPorject: ProjectModel) => {

    // this.listtemplateProjects[indexProject].setProject(dataPorject);

    this.listtemplateProjects[indexProject].project = dataPorject;


  }, (error: any) => {


   });

}



checkFavorisProject(indexProject){

  this.ngxService.start();

  // tslint:disable-next-line:max-line-length
  this.apiService.checkFavorisProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {


    this.listtemplateProjects[indexProject].favorisProject = 1;

    this.ngxService.stop();

  }, (error: any) => {

    this.listtemplateProjects[indexProject].favorisProject = 0;

    this.ngxService.stop();
  });

}

  checkFavorisProjectForBdd(indexProject){

    this.ngxService.start();

    // tslint:disable-next-line:max-line-length
    this.apiService.checkFavorisProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {

      this.listtemplateProjects[indexProject].favorisProject = 1;

      this.ngxService.stop();

    }, (error: any) => {

      this.addProjectByMyFavorisForBdd(indexProject);

      this.ngxService.stop();
    });

  }

  removeProjectByMyFavoris(indexProject){

    this.ngxService.start();

    // tslint:disable-next-line:max-line-length
    this.apiService.deleteFavorisProjectByUser(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {

      this.listtemplateProjects[indexProject].favorisProject = 0;

      this.ngxService.stop();

  }, (error: any) => {

    this.ngxService.stop();
  });

  }

  addProjectByMyFavorisForBdd(indexProject){

    this.ngxService.start();


    this.apiService.addProjectByMyFavoris(this.ObjetResponseConnection, this.listProjects[indexProject].token).subscribe((data: any) => {


       this.listtemplateProjects[indexProject].favorisProject = 1;

       this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
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

      this.listProjectsTemp = this.listProjects;


      /********************************************************** */


    }


  }


}
