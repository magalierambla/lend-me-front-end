import { commentProjectRequestModel, PorteProjectModel, StatutDemandeInvest, TypeStatistiqueModel } from './../interfaces/models';
import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './../image.service';
import {
   UserModel, ProjectModel, templteProjectModel, ImageProjectModel, AdressReseauxSociauxProjectModel, commentProjectModel,
   StatistiquesChartsHeartModel, StatistiquesChartsVueModel, InvestiteurProjectModel, fondInvestor, StatistiquesChartsLikeModel,
    StatistiquesChartsDislikesModel, NewsProjectModel, CategorieProjectModel, StatutProjectModel,
     ResponseConnectionUserModel, QuestionRepProjectRequestModel, userDestModel, QuestionRepProjectModel
} from '../interfaces/models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2/dist/sweetalert2.js';


declare var window: any;

@Component({
   selector: 'app-my-project-show-company-owner',
   templateUrl: './my-project-show-company-owner.component.html',
   styleUrls: ['./my-project-show-company-owner.component.css']
})
export class MyProjectShowCompanyOwnerComponent implements OnInit {


   public infosUser: UserModel = new UserModel();

   public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

   public ObjetProject: ProjectModel = new ProjectModel();

   public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

   public imagesProjects: Array<ImageProjectModel> = [];

   public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

   public ObjetComment: commentProjectRequestModel = new commentProjectRequestModel();

   public listCommentsForProject: Array<commentProjectModel> = [];


   public listeStatusProject = [
      { key: 1, value: 'Valider le porjet' },
      { key: 2, value: 'Terminer le porjet' },
      { key: 3, value: 'Annuler le porjet' }
   ];

   public tokenProject = '';

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
   barChartDataVues: ChartDataSets[] = [  { data: [], label: 'Nombre de vue  ' } ];

   barChartLabelsLikes: Label[] = [];
   barChartDataLikes: ChartDataSets[] = [  { data: [], label: 'Nombre de likes  ' } ];

   barChartLabelsDislikes: Label[] = [];
   barChartDataDislikes: ChartDataSets[] = [  { data: [], label: 'Nombre de dsilikes  ' } ];

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




/********************************************************************* */

// tslint:disable-next-line:ban-types
public options: Object = {
                        charCounterCount: true,
                        attribution: false,
                        placeholderText: 'Décrivez brièvement votre nouvelle de projet *',
                        heightMin: 200
 /*  toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
   toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
   toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
   toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],*/
 };

 public addNewsProjectForm: FormGroup;

 public submitted = false;

 public ObjetNewsProject: NewsProjectModel = new NewsProjectModel();

 public imageFileNews: File;

 public srcImageNews = 'http://placehold.it/500x325';

 public listNewsProject: Array<NewsProjectModel> = [];

/********************************************************************* */
   constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private cookie: CookieService,
               private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
               private datePipe: DatePipe, public sanitizer: DomSanitizer, private imageService: ImageService) {

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

         this.router.navigate(['/Identification']);
      }


   }

   ngOnInit(): void {

      const ObjetProject = new ProjectModel();

      ObjetProject.setUserProject(new UserModel());

      ObjetProject.setCategorieProject(new CategorieProjectModel());

      ObjetProject.setStatutProject(new StatutProjectModel());

      ObjetProject.setPorteProject(new PorteProjectModel());

      this.ObjetProjectTemplate.setProject(ObjetProject);

      this.addNewsProjectForm = this.formBuilder.group({
                                                      titreNews: ['', Validators.required],
                                                      descriptionNews: ['', Validators.required],

       });


   }

   tinyAlert(message: string){

      Swal.fire(message);
   }



   get f() { return this.addNewsProjectForm.controls; }

   imageNewsInputChange(imageInput: any) {

      this.imageFileNews = imageInput.files[0];

      this.addImageNewsProject();

    }

    addImageNewsProject(){

      if (this.imageFileNews){

         this.ngxService.start();

         const infoObjectphotos = {
                         title: 'image_affiche_',
                         description:  'image_affiche_project'
               };



         this.imageService.uploadImage(this.imageFileNews, infoObjectphotos).then((imageData: any) => {

         console.log(imageData.data.link);

         this.ObjetNewsProject.photos = imageData.data.link;

         this.srcImageNews  = imageData.data.link;

         this.ngxService.stop();


        });


       }else{

         this.tinyAlert('Veuillez telecharger une image svp');
       }


    }

   onFormSubmitAddNewsProject(){

      this.submitted = true;

      if (this.addNewsProjectForm.invalid) {
         return;
      }

      const date = new Date();

      this.ObjetNewsProject.date_created = date.toLocaleString('fr-FR', {
                                                                              weekday: 'long',
                                                                              year: 'numeric',
                                                                              month: 'long',
                                                                              day: 'numeric',
                                                                              hour: 'numeric',
                                                                              minute: 'numeric',
                                                                              second: 'numeric',
     });

      this.ObjetNewsProject.timestamp = Date.now();

      this.ngxService.start();

      // tslint:disable-next-line:max-line-length
      this.apiService.addNewsProjectByUser(this.ObjetResponseConnection, this.tokenProject, this.ObjetNewsProject).subscribe((dataNews: NewsProjectModel) => {


         this.getListNewsProject();


         this.ngxService.stop();

      }, (error: any) => {

        this.ngxService.stop();
      });


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
      this.apiService.getDataProjectForUser(this.ObjetResponseConnection, tokenProject, 'porteur_project').subscribe((dataProject: ProjectModel) => {

         console.log('dataPorject = ', dataProject);

         this.ObjetProjectTemplate.project = dataProject;

         this.ObjetProject = dataProject;

         const dateCurrent = new Date();

         const dateProject = new Date(dataProject.created_at);



         if (this.ObjetProjectTemplate.project.description.indexOf('<p>') >= 0){

            this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substr(3);

         }

         if (this.ObjetProjectTemplate.project.description.indexOf('</p>') >= 0){

            // tslint:disable-next-line:max-line-length
            this.ObjetProjectTemplate.project.description = this.ObjetProjectTemplate.project.description.substring(0, this.ObjetProjectTemplate.project.description.length - 4 );
        }



         // alert('anneProject' + dateProject.getFullYear());

         // alert('anne-en-cours' + dateCurrent.getFullYear());


         for (let index = 0; index <= dateCurrent.getFullYear() - dateProject.getFullYear(); index++) {

            // alert(dateProject.getFullYear() + index);

            this.listYearProject.push(dateProject.getFullYear() + index);

         }



         if (dataProject.manager_project) {

            this.getInfosManagerProject();
         }

         this.formaterProject();

         this.getListArrayAdressReseauxSociauxProject();

         this.getListQuestionsAides();

         this.getListCommentsProject();

         this.getListNewsProject();

         this.getAllImageProject();

         this.getStatustiquesHeartsChart();

         this.getStatustiquesVuesChart();

         this.getStatustiquesLikesChart();

         this.getStatustiquesDislikesChart();

         this.getListInvestorByProject();

         this.getAllFondsInvest();

         /******************************************** */

      /*   this.pollingComment = setInterval(() => {

            this.getListCommentsProject();

         }, 10 * 1000); */

         /***************************************** */

       /*  this.polling = setInterval(() => {

            this.getListQuestionsAides();

            this.getListInvestorByProject();

            this.getAllFondsInvest();

         }, 10 * 1000); */


         /******************************************* */

         this.ngxService.stop();


      }, (error: any) => {

         this.ngxService.stop();
      });


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


   getInfosManagerProject() {


      // tslint:disable-next-line:max-line-length
      if (this.ObjetProjectTemplate.project.manager_project.photoUser === '' || !this.ObjetProjectTemplate.project.manager_project.photoUser) {



         if (this.ObjetProjectTemplate.project.manager_project.sex === 'F') {



            this.ObjetProjectTemplate.project.manager_project.photoUser = './assets/img/users/user_f.png';


         }

         if (this.ObjetProjectTemplate.project.manager_project.sex === 'H') {



            this.ObjetProjectTemplate.project.manager_project.photoUser = './assets/img/users/user_m.png';


         }

      }


   }

   getListArrayAdressReseauxSociauxProject() {


      this.apiService.getListArrayAdressReseauxSociauxProject(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


         console.log('data-Adress-sociaux', data);

         this.arrayAdressReseauxSociauxProject = data;

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

   onFormSubmitComment() {

      const date = new Date();

      this.ObjetComment.dateCreated = date.toLocaleString('fr-FR', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
      });

      this.ObjetComment.timestamp = Date.now();

      this.ngxService.start();

      // tslint:disable-next-line:max-line-length
      this.apiService.addCommentProject(this.ObjetResponseConnection, this.tokenProject, this.ObjetComment).subscribe((dataComment: any) => {

         console.log(dataComment);

         this.getListCommentsProject();

         this.ngxService.stop();


      }, (error: any) => { this.ngxService.stop(); });

   }


   confDemandeInvest(ObjectDemandeInvest: InvestiteurProjectModel) {

      const  _statutDemandeInvest = new StatutDemandeInvest();

      _statutDemandeInvest.statut_demande = 'VALIDE';

      // tslint:disable-next-line:max-line-length
      this.apiService.updateDemandeInvestorByProject(this.ObjetResponseConnection, this.tokenProject, ObjectDemandeInvest.token, _statutDemandeInvest).subscribe((dataConfirm: any) => {

         console.log(dataConfirm);

         this.getListInvestorByProject();

      }, (error: any) => {

      });



   }

   declinerDemandeInvest(ObjectDemandeInvest: InvestiteurProjectModel) {

      const  _statutDemandeInvest = new StatutDemandeInvest();

      _statutDemandeInvest.statut_demande = 'ANNULE';


      // tslint:disable-next-line:max-line-length
      this.apiService.updateDemandeInvestorByProject(this.ObjetResponseConnection, this.tokenProject, ObjectDemandeInvest.token, _statutDemandeInvest).subscribe((dataConfirm: any) => {

         console.log(dataConfirm);

         this.getListInvestorByProject();

      }, (error: any) => {

      });



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

         this.ObjetProjectTemplate.getProject().date_limite_collecte = this.datePipe.transform(this.ObjetProject.date_limite_collecte, 'dd-MM-yyyy');


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

   onFormSubmitQuestionForManager() {

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

      _userDest.token = this.ObjetProject.manager_project.token;

      this.objectQuestionRepProject._userDest = _userDest;


      // tslint:disable-next-line:max-line-length
      this.apiService.createQuestionReponses(this.ObjetResponseConnection, this.tokenProject, this.objectQuestionRepProject).subscribe((dataQuestion: any) => {

         console.log('createQuestionReponsesByUserForAdmin = ', dataQuestion);

         this.getListQuestionsAides();


      }, (error: any) => { });

   }

   replyByPorteurProjectForUser(objectquestionUser) {

      this.objectQuestionRepProject = new QuestionRepProjectRequestModel();

      const _userDest = new userDestModel();

      _userDest.token = objectquestionUser.token;

      this.objectQuestionRepProject._userDest = _userDest;

      this.showTextera = true;

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





}
