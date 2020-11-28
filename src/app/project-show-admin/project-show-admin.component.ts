import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { UserModel, ProjectModel, templteProjectModel, ImageProjectModel
  , AdressReseauxSociauxProjectModel, commentProjectModel, StatutProjectModel,
  InvestiteurProjectModel, fondInvestor, StatistiquesChartsLikeModel, StatistiquesChartsDislikesModel,
  StatistiquesChartsHeartModel, StatistiquesChartsVueModel, NewsProjectModel, CommissionProjectModel,
  PorteProjectModel, CategorieProjectModel, ResponseConnectionUserModel, TypeStatistiqueModel,
   QuestionRepProjectRequestModel, QuestionRepProjectModel, userDestModel } from '../interfaces/models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { Title } from '@angular/platform-browser';

import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-project-show-admin',
  templateUrl: './project-show-admin.component.html',
  styleUrls: ['./project-show-admin.component.css']
})
export class ProjectShowAdminComponent implements OnInit {



  public infosUser: UserModel = new UserModel();

  public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

  public ObjetProject: ProjectModel = new ProjectModel();

  // public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

  public imagesProjects: Array<ImageProjectModel> = [];

  public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

  public ObjetComment: commentProjectModel = new commentProjectModel();

  public listCommentsForProject: Array<commentProjectModel> = [];

  public listeStatusProject: Array<StatutProjectModel> = [];

  public tokenProject = '';

  public showForValidation = false;

  public indexStatut;

  public photoUserAdmin = './assets/img/users/user_f.png';

  public polling: any;

  public pollingComment: any;

  public page = 1;

  public pageSize = 4;

  public collectionSize = 0;

  public checkInvest = false;

  public showTextera = false;

  public objectQuestionRepProject: QuestionRepProjectRequestModel = new QuestionRepProjectRequestModel();

  public listQuestionsAidesByUserByAdmin: Array<QuestionRepProjectModel> = [];

  public listQuestionsAidesByUserForUser: Array<QuestionRepProjectModel> = [];

  public listInvestor: Array<InvestiteurProjectModel> = [];

  public pageBis = 1;

  public pageSizeBis = 4;

  public collectionSizeBis = 0;

  public listFonsInvest: Array<fondInvestor> = [];

     /*************************************************************** */

   barChartOptions: ChartOptions = {
      responsive: true,
     };
   barChartType: ChartType = 'bar';
   barChartLegend = true;
   barChartPlugins = [];

   barChartLabelsHearts: Label[] = [];
   barChartDataHearts: ChartDataSets[] = [  { data: [], label: 'Nombre de coup de coeur ' } ];

   barChartLabelsVues: Label[] = [];
   barChartDataVues: ChartDataSets[] = [  { data: [], label: 'Nombre de vue de coeur ' } ];

   barChartLabelsLikes: Label[] = [];
   barChartDataLikes: ChartDataSets[] = [  { data: [], label: 'Nombre de likes de coeur ' } ];

   barChartLabelsDislikes: Label[] = [];
   barChartDataDislikes: ChartDataSets[] = [  { data: [], label: 'Nombre de dsilikes de coeur ' } ];

/********************************************************************* */

/********************************************************************* */

barChartLabelsDaysHearts: Label[] = [];
barChartDataDaysHearts: ChartDataSets[] = [  { data: [], label: 'Nombre de coup de coeur ' } ];

barChartLabelsDaysVues: Label[] = [];
barChartDataDaysVues: ChartDataSets[] = [  { data: [], label: 'Nombre de vue  ' } ];

barChartLabelsDaysLikes: Label[] = [];
barChartDataDaysLikes: ChartDataSets[] = [  { data: [], label: 'Nombre de likes  ' } ];

barChartLabelsDaysDislikes: Label[] = [];
barChartDataDaysDislikes: ChartDataSets[] = [  { data: [], label: 'Nombre de dsilikes  ' } ];


/********************************************************************* */

public isShowChartsMens = true;

public isShowChartsDays = false;

public isShowFormSelectDays = false;

public datePickerConfig = {
                    drops: 'down',
                    format: 'YYYY',
                    monthFormat: 'YYYY',
                    locale: 'fr',
                    addClass: 'form-control'
 };

 public datePickerConfigBis = {
   drops: 'down',
   format: 'MM',
   monthFormat: 'MM',
   locale: 'fr',
   addClass: 'form-control'
 };

public ObjetOptionStatMonth: { year: string , month: string} = {year : '', month : ''};

public listYearProject = [];

public listNewsProject: Array<NewsProjectModel> = [];


/********************************************************************* */

public montantCommision = 0;

public showActionCommision = false;

public objectCommissionProject: CommissionProjectModel = new CommissionProjectModel();

  constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
              private datePipe: DatePipe, public sanitizer: DomSanitizer, private titleService: Title) {



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

                  this.route.params.subscribe(params => {

                    this.tokenProject = params.token;

                    this.getinfosProject(params.token);

                  });

                  console.log('ProfilUserComponent', this.infosUser);



    } else {

      this.router.navigate(['/admin-login']);
    }




  }

  ngOnInit(): void {

    const newProject = new ProjectModel();

    newProject.setPorteProject(new PorteProjectModel());

    newProject.setCategorieProject(new CategorieProjectModel());

    newProject.setStatutProject(new StatutProjectModel());

    newProject.setUserProject(new UserModel());

    this.ObjetProjectTemplate.setProject(newProject);
  }

  getListNewsProject(){


    this.listNewsProject = [];

    // tslint:disable-next-line:max-line-length
    this.apiService.getListNewsProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((arrayNewsProject: Array<NewsProjectModel>) => {


       this.listNewsProject = arrayNewsProject;

       // tslint:disable-next-line:prefer-for-of
       for (let index = 0; index < this.listNewsProject.length; index++) {

          this.listNewsProject[index].description = this.listNewsProject[index].description.substr(3);

          // tslint:disable-next-line:max-line-length
          this.listNewsProject[index].description = this.listNewsProject[index].description.substr(0, this.listNewsProject[index].description.length - 4);


       }

       this.listNewsProject = this.listNewsProject.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => { });

 }

  getinfosProject(tokenProject) {


    this.ngxService.start();

    // tslint:disable-next-line:max-line-length
    this.apiService.getDataProjectForUser(this.ObjetResponseConnection, tokenProject, 'user').subscribe((dataPorject: ProjectModel) => {

      // console.log('dataPorject = ', dataPorject);

      this.ObjetProject = dataPorject;

      this.ObjetProjectTemplate.setProject(dataPorject);

      this.titleService.setTitle('Fiche-projet [' + this.ObjetProjectTemplate.project.nom + ']');

      const dateCurrent = new Date();

      const dateProject = new Date(dataPorject.created_at);

      for (let index = 0; index <= dateCurrent.getFullYear() - dateProject.getFullYear(); index++) {

        // alert(dateProject.getFullYear() + index);

        this.listYearProject.push(dateProject.getFullYear() + index);

     }

      if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0){

      this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

      }

      if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0){

      // tslint:disable-next-line:max-line-length
      this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4 );
      }

      // tslint:disable-next-line:max-line-length
      if (dataPorject._statut_project.nom === 'Valide'  || dataPorject._statut_project.nom === 'Renouvele' || dataPorject._statut_project.nom === 'Termine'){

         this.getListCommentsProject();

         this.getListInvestorByProject();

         this.getAllFondsInvest();

         this.getStatustiquesHeartsChart();

         this.getStatustiquesVuesChart();

         this.getStatustiquesLikesChart();

         this.getStatustiquesDislikesChart();

         this.getListNewsProject();

         this.checkCommisionProject();

         this.getListCommentsProject();
      }

      if (this.ObjetProjectTemplate.project.manager_project) {

        this.showForValidation = true;

        this.getListQuestionsAides();

      }

      this.formaterProject();

      this.getListStatutProject();

      this.getListArrayAdressReseauxSociauxProject();

      this.getAllImageProject();

      this.getInfosUser();


      this.montantCommision = dataPorject.total_fonds * 0.05;

      /******************************************************** */

   /*   this.pollingComment = setInterval(() => {

        this.getListCommentsProject();

      }, 10 * 1000); */

      /**************************************************** */



  /*    this.polling = setInterval(() => {

        this.getListQuestionsAides();

        this.getListQuestionsAidesForInvestor();

        this.getListInvestorByProject();

        this.getAllFondsInvest();

      }, 10 * 1000); */


      /******************************************************** */

      this.ngxService.stop();


    }, (error: any) => {

      this.ngxService.stop();
    });


  }

  checkCommisionProject(){


  this.apiService.checkCommissionProjectByManager(this.ObjetResponseConnection, this.tokenProject).subscribe((dataResp: any) => {

      if (!dataResp.success){


          this.showActionCommision = true;

      }else{

        this.showActionCommision = false;
      }


   }, (error: any) => {  });

  }

  addCommisionProject(){


    const date = new Date();

    this.objectCommissionProject.date_created = date.toLocaleString('fr-FR', {
                                                                             weekday: 'long',
                                                                             year: 'numeric',
                                                                             month: 'long',
                                                                             day: 'numeric',
                                                                             hour: 'numeric',
                                                                             minute: 'numeric',
                                                                             second: 'numeric',

    });

    this.objectCommissionProject.amount = this.montantCommision; 

    // tslint:disable-next-line:max-line-length
    this.apiService.addCommissionProjectByManager(this.ObjetResponseConnection, this.tokenProject, this.objectCommissionProject ).subscribe((dataResp: any) => {

      if (dataResp.success){


        this.checkCommisionProject();

    }


   }, (error: any) => {    });




  }

  onSelectMonthStatisMonth(value){



    console.log('this.ObjetOptionStatDays.month =', this.ObjetOptionStatMonth.month);

    console.log('this.ObjetOptionStatDays.year =', this.ObjetOptionStatMonth.year);



    this.getStatustiquesHeartsDaysChart();

    this.getStatustiquesVueDaysChart();

    this.getStatustiquesLikeDaysChart();

    this.getStatustiquesDislikeDaysChart();

    this.isShowChartsDays = true;



 }

 onChangeTypeStatistique(value){


     // console.log('value = ', value);

     if (value === 'month'){

         this.isShowChartsDays = false;

         this.isShowChartsMens = true;

         this.isShowFormSelectDays = false;

     }

     if (value === 'day'){

       this.isShowChartsDays = false;

       this.isShowFormSelectDays = true;

       this.isShowChartsMens = false;

    }

 }

 getStatustiquesLikeDaysChart(){

  this.barChartDataDaysLikes[0].data = [];

  this.barChartLabelsDaysLikes = [];

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'ByMonthByYear';

  _type_stat.year = this.ObjetOptionStatMonth.year;

  _type_stat.month = this.ObjetOptionStatMonth.month;

  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayLike: Array<StatistiquesChartsLikeModel>) => {

     dataArrayLike.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataDaysLikes[0].data.push(element.nbrLikes);

        this.barChartLabelsDaysLikes.push(element.day);


 });


  }, (error: any) => {    });



}


getStatustiquesDislikeDaysChart(){

this.barChartDataDaysDislikes[0].data = [];

this.barChartLabelsDaysDislikes = [];

const _type_stat  = new TypeStatistiqueModel();

_type_stat.type_statistique = 'ByMonthByYear';

_type_stat.year = this.ObjetOptionStatMonth.year;

_type_stat.month = this.ObjetOptionStatMonth.month;

// tslint:disable-next-line:max-line-length
this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayDislike: Array<StatistiquesChartsDislikesModel>) => {

  dataArrayDislike.forEach(element => {

     console.log(element);

     /*********************************************** */

     this.barChartDataDaysDislikes[0].data.push(element.nbrDislikes);

     this.barChartLabelsDaysDislikes.push(element.day);


});


}, (error: any) => {    });



}


getStatustiquesVueDaysChart(){

  this.barChartDataDaysVues[0].data = [];

  this.barChartLabelsDaysVues = [];

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'ByMonthByYear';

  _type_stat.year = this.ObjetOptionStatMonth.year;

  _type_stat.month = this.ObjetOptionStatMonth.month;

     // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayVue: Array<StatistiquesChartsVueModel>) => {

        dataArrayVue.forEach(element => {

           console.log(element);

           /*********************************************** */

           this.barChartDataDaysVues[0].data.push(element.nbrVues);

           this.barChartLabelsDaysVues.push(element.day);


    });


     }, (error: any) => {    });



}

getStatustiquesHeartsDaysChart(){

  this.barChartDataDaysHearts[0].data = [];

  this.barChartLabelsDaysHearts = [];

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'ByMonthByYear';

  _type_stat.year = this.ObjetOptionStatMonth.year;

  _type_stat.month = this.ObjetOptionStatMonth.month;


  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayHeart: Array<StatistiquesChartsHeartModel>) => {

     dataArrayHeart.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataDaysHearts[0].data.push(element.nbrHearts);

        this.barChartLabelsDaysHearts.push(element.day);


 });


  }, (error: any) => {    });

}



getStatustiquesHeartsChart(){

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'Last12Month';

  _type_stat.year = '0';

  _type_stat.month = '0';


  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesHeartsChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayHeart: Array<StatistiquesChartsHeartModel>) => {

     dataArrayHeart.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataHearts[0].data.push(element.nbrHearts);

        this.barChartLabelsHearts.push(element.month);


 });


  }, (error: any) => {    });

}

getStatustiquesVuesChart(){

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'Last12Month';

  _type_stat.year = '0';

  _type_stat.month = '0';


  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesVuesChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayVue: Array<StatistiquesChartsVueModel>) => {

     dataArrayVue.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataVues[0].data.push(element.nbrVues);

        this.barChartLabelsVues.push(element.month);


 });


  }, (error: any) => {


 });

}

getStatustiquesLikesChart(){

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'Last12Month';

  _type_stat.year = '0';

  _type_stat.month = '0';


  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesLikesChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayLike: Array<StatistiquesChartsLikeModel>) => {

     dataArrayLike.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataLikes[0].data.push(element.nbrLikes);

        this.barChartLabelsLikes.push(element.month);


 });


  }, (error: any) => {


 });

}

getStatustiquesDislikesChart(){

  const _type_stat  = new TypeStatistiqueModel();

  _type_stat.type_statistique = 'Last12Month';

  _type_stat.year = '0';

  _type_stat.month = '0';


  // tslint:disable-next-line:max-line-length
  this.apiService.getStatistiquesDislikesChartsByUser(this.ObjetResponseConnection, this.tokenProject, _type_stat).subscribe((dataArrayDislikes: Array<StatistiquesChartsDislikesModel>) => {

     dataArrayDislikes.forEach(element => {

        console.log(element);

        /*********************************************** */

        this.barChartDataDislikes[0].data.push(element.nbrDislikes);

        this.barChartLabelsDislikes.push(element.month);


 });


  }, (error: any) => {


 });

}


onFormSubmitQuestionForUser() {


  const date = new Date();

  this.objectQuestionRepProject.dateCreated = date.toLocaleString('fr-FR', {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric',
     hour: 'numeric',
     minute: 'numeric',
     second: 'numeric',

  });

  this.objectQuestionRepProject.timestamp = Date.now();

  const _userDest = new userDestModel();

  _userDest.token = this.ObjetProjectTemplate.getProject()._user.token;

  this.objectQuestionRepProject._userDest = _userDest;

   /****************************************************************************** */


  // tslint:disable-next-line:max-line-length
  this.apiService.createQuestionReponses(this.ObjetResponseConnection, this.tokenProject, this.objectQuestionRepProject).subscribe((dataQuestion: any) => {

     // console.log(dataQuestion);

     this.getListQuestionsAides();

     this.showTextera = false;


  }, (error: any) => {

  });
}

getListQuestionsAides() {


  this.listQuestionsAidesByUserByAdmin = [];

  this.listQuestionsAidesByUserForUser = [];

  /*************************************************************************************** */

  // recuperer la liste des questions envoye par l'admin (id-admin ='1' ) pour le compagny owner

  // tslint:disable-next-line:max-line-length
  this.apiService.getListQuestionReponsesBetweenManagerAndUser(this.ObjetResponseConnection, this.tokenProject).subscribe((arrayQuestionByAdminForUser: Array<QuestionRepProjectModel>) => {


     // tslint:disable-next-line:prefer-for-of
     for (let index = 0; index < arrayQuestionByAdminForUser.length; index++) {

        if (arrayQuestionByAdminForUser[index]._userExp.photoUser === '' || !arrayQuestionByAdminForUser[index]._userExp.photoUser) {

           if (arrayQuestionByAdminForUser[index]._userExp.sex === 'F') {

              arrayQuestionByAdminForUser[index]._userExp.photoUser = './assets/img/users/user_f.png';


           }

           if (arrayQuestionByAdminForUser[index]._userExp.sex === 'H') {

              arrayQuestionByAdminForUser[index]._userExp.photoUser = './assets/img/users/user_m.png';


           }

        }

         // tslint:disable-next-line:max-line-length
        if (arrayQuestionByAdminForUser[index]._userDest.roles[0].name === 'ROLE_USER' &&  arrayQuestionByAdminForUser[index]._userExp.roles[0].name === 'ROLE_USER' ){

           this.listQuestionsAidesByUserForUser.push(arrayQuestionByAdminForUser[index]);

         }else{

           this.listQuestionsAidesByUserByAdmin.push(arrayQuestionByAdminForUser[index]);
         }


     }

    //  console.log('listQuestionsAidesByUserByAdmin', this.listQuestionsAidesByUserByAdmin);

     this.listQuestionsAidesByUserByAdmin = this.listQuestionsAidesByUserByAdmin.sort((c1, c2) => c2.timestamp - c1.timestamp);


  }, (error: any) => { });


  /************************************************************************************ */

  this.listQuestionsAidesByUserByAdmin = this.listQuestionsAidesByUserByAdmin.sort((c1, c2) => c2.timestamp - c1.timestamp);

  this.listQuestionsAidesByUserForUser = this.listQuestionsAidesByUserForUser.sort((c1, c2) => c2.timestamp - c1.timestamp);


}

getListInvestorByProject() {

  this.listInvestor = [];


  // tslint:disable-next-line:max-line-length
  this.apiService.getListInvestorByProject(this.ObjetResponseConnection, this.tokenProject, 'porteur_project').subscribe((dataInvestor: any) => {

     console.log('dataInvestor', dataInvestor);

     // tslint:disable-next-line:prefer-for-of
     for (let index = 0; index < dataInvestor.length; index++) {



        if (dataInvestor[index]._userProjectInvest.photoUser === ''  || !dataInvestor[index]._userProjectInvest.photoUser) {

           if (dataInvestor[index]._userProjectInvest.sex === 'F') {

              dataInvestor[index]._userProjectInvest.photoUser = './assets/img/users/user_f.png';


           }

           if (dataInvestor[index]._userProjectInvest.sex === 'H') {

              dataInvestor[index]._userProjectInvest.photoUser = './assets/img/users/user_m.png';


           }

        }

        this.listInvestor.push(dataInvestor[index]);

     }




  }, (error: any) => { });


}

getAllFondsInvest() {

  this.listFonsInvest = [];

  // tslint:disable-next-line:max-line-length
  this.apiService.getAllFondsInvestByProjectForPorteurProject(this.ObjetResponseConnection, this.tokenProject).subscribe((arrayFondsInvestor: Array<fondInvestor>) => {

     // tslint:disable-next-line:prefer-for-of
     for (let index = 0; index < arrayFondsInvestor.length; index++) {



        // tslint:disable-next-line:max-line-length
        if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser === ''  || !arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser) {

           if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.sex === 'F') {

              arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser = './assets/img/users/user_f.png';


           }

           if (arrayFondsInvestor[index]._investisseurProject._userProjectInvest.sex === 'H') {

              arrayFondsInvestor[index]._investisseurProject._userProjectInvest.photoUser = './assets/img/users/user_m.png';


           }

        }

        this.listFonsInvest.push(arrayFondsInvestor[index]);

     }



     console.log(arrayFondsInvestor);

  }, (error: any) => {

  });

}

getListArrayAdressReseauxSociauxProject() {


  this.apiService.getListArrayAdressReseauxSociauxProject(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


     console.log('data-Adress-sociaux', data);

     this.arrayAdressReseauxSociauxProject = data;

  }, (error: any) => {

  });

}

  getListStatutProject() {


    if (this.ObjetProjectTemplate.project._statut_project.nom !== 'Annule'  ){

      this.showForValidation = true;


    }

    this.apiService.getListStatutProject().subscribe((data: Array<StatutProjectModel>) => {


      console.log('data-ListStatutProject', data);

      console.log('data-Statut-Project =', this.ObjetProjectTemplate.project._statut_project.nom);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < data.length; index++) {

        if (this.ObjetProjectTemplate.project._statut_project.nom === 'Attente'){

              if (data[index].nom !== 'Renouvele'  && data[index].nom !== 'Attente' && data[index].nom !== 'Termine'){

                this.listeStatusProject.push(data[index]);

              }
        }

        /******************************************************* */

        if (this.ObjetProjectTemplate.project._statut_project.nom === 'Valide'){

            if (data[index].nom !== 'En cours' && data[index].nom !== 'Attente' && data[index].nom !== 'Valide'){

              this.listeStatusProject.push(data[index]);

            }

        }

        /******************************************************* */

        if (this.ObjetProjectTemplate.project._statut_project.nom === 'En cours'){

          if (data[index].nom !== 'Renouvele' && data[index].nom !== 'En cours' && data[index].nom !== 'Attente' && data[index].nom !== 'Termine'){

            this.listeStatusProject.push(data[index]);

          }

       }

        /******************************************************* */

        if (this.ObjetProjectTemplate.project._statut_project.nom === 'Renouvele'){

          if (data[index].nom !== 'Renouvele' && data[index].nom !== 'En cours' && data[index].nom !== 'Attente' && data[index].nom !== 'Termine' && data[index].nom !== 'Valide'){

            this.listeStatusProject.push(data[index]);

          }

       }


        /******************************************************* */

        if (this.ObjetProjectTemplate.project._statut_project.nom === 'Termine'){

          if ( data[index].nom !== 'Annule' && data[index].nom !== 'En cours' && data[index].nom !== 'Attente' && data[index].nom !== 'Termine' && data[index].nom !== 'Valide'){

            this.listeStatusProject.push(data[index]);

          }

       }

       /********************************************************** */

      }



    }, (error: any) => {

    });

  }

  getListCommentsProject() {

    this.listCommentsForProject = [];

    // tslint:disable-next-line:max-line-length
    this.apiService.getListArrayCommentsProject(this.ObjetResponseConnection, this.tokenProject).subscribe((dataComments: any) => {

       console.log('dataComments', dataComments);

       // tslint:disable-next-line:prefer-for-of
       for (let index = 0; index < dataComments.length; index++) {



          if (dataComments[index].user.photoUser === ''  ||  !dataComments[index].user.photoUser) {

             if (dataComments[index].user.sex === 'F') {

                dataComments[index].user.photoUser = './assets/img/users/user_f.png';


             }

             if (dataComments[index].user.sex === 'H') {

                dataComments[index].user.photoUser = './assets/img/users/user_m.png';


             }

          }

          this.listCommentsForProject.push(dataComments[index]);

       }

       console.log('listCommentsForProject', this.listCommentsForProject);

       this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);


    }, (error: any) => { });



    this.listCommentsForProject = this.listCommentsForProject.sort((c1, c2) => c2.timestamp - c1.timestamp);

 }

  onChangeStatutProject() {

    this.alertConfirmation();

  }

  changeStatutByApelApi(){

    this.ngxService.start();

    console.log('indexStatut', this.indexStatut);

    // tslint:disable-next-line:max-line-length
    this.apiService.updateDataProjectByManager(this.ObjetResponseConnection, this.tokenProject, this.listeStatusProject[this.indexStatut].token).subscribe((dataProject: ProjectModel) => {

      console.log('updateStautProject = ', dataProject);

      this.ngxService.stop();

      this.tinyAlert('Votre changement de statut a été éffactué avec succées');

    }, (error: any) => { });

  }

  tinyAlert(message: string){

    Swal.fire(message);
  }

  alertConfirmation(){
    Swal.fire({
      title: 'Vous etes sure?',
      text: 'Le changement de statut demandé sera :' + this.listeStatusProject[this.indexStatut].nom,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Je confirme le changement du statut.',
      cancelButtonText: 'J\'annule l\'action.'
    }).then((result) => {
      if (result.value) {
        this.changeStatutByApelApi();

      }

    });
  }



  getInfosUser() {


    if (this.ObjetProjectTemplate.project._user.photoUser === ''  || !this.ObjetProjectTemplate.project._user.photoUser) {

      if (this.ObjetProjectTemplate.project._user.sex === 'F') {

        this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_f.png';


      }

      if (this.ObjetProjectTemplate.project._user.sex === 'H') {

        this.ObjetProjectTemplate.project._user.photoUser = './assets/img/users/user_m.png';


      }

    }


  }

  getAllImageProject() {


    // tslint:disable-next-line:max-line-length
    this.apiService.getAllImagesByIdProject(this.ObjetResponseConnection, this.tokenProject).subscribe((dataImages: Array<ImageProjectModel>) => {

       console.log(dataImages);

       this.imagesProjects = dataImages;

    }, (error: any) => {

    });



 }

  formaterProject() {


    /****************************************************** */
     // tslint:disable-next-line:max-line-length
     this.ObjetProjectTemplate.project.date_limite_collecte = this.datePipe.transform( this.ObjetProjectTemplate.project.date_limite_collecte, 'dd-MM-yyyy');

     // tslint:disable-next-line:max-line-length
     this.ObjetProjectTemplate.project._user.date_naissance = this.datePipe.transform( this.ObjetProjectTemplate.project._user.date_naissance, 'dd-MM-yyyy');
   
     /******************************************************* */

     if (this.ObjetProject._statut_project.nom === 'Attente' ){


        this.ObjetProjectTemplate.project._statut_project.nom = 'Attente';

       }

     if (this.ObjetProject._statut_project.nom === 'Valide'){


      this.ObjetProjectTemplate.project._statut_project.nom = 'Validé';

       }

     if (this.ObjetProject._statut_project.nom === 'Termine'){


      this.ObjetProjectTemplate.project._statut_project.nom = 'Terminé';

       }

     if (this.ObjetProject._statut_project.nom === 'Annule'){


      this.ObjetProjectTemplate.project._statut_project.nom = 'Annulé';

       }

     if (this.ObjetProject._statut_project.nom === 'Renouvele'){


        this.ObjetProjectTemplate.project._statut_project.nom = 'Renouvelé';

      }

     if (this.ObjetProject._statut_project.nom === 'Renouvele'){


          this.ObjetProjectTemplate.project._statut_project.nom = 'Renouvelé';

     }

    /******************************************************* */

  }



}
