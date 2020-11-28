import { templteProjectModel } from './../interfaces/models';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {UserModel, ProjectModel,
       ImageProjectModel, AdressReseauxSociauxProjectModel, commentProjectModel,
       LikeProjectUserModel, VueProjectUserModel,
       HeartProjectUserModel, FavorisProjectUserModel,
       NewsProjectModel, StatutProjectModel, PorteProjectModel, CategorieProjectModel,
       InvestiteurProjectModel, fondInvestor,
        ResponseConnectionUserModel, QuestionRepProjectModel, QuestionRepProjectRequestModel, userDestModel} from '../interfaces/models';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import { IpServiceService } from './../ip-service.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var window: any;



@Component({
   selector: 'app-project-show-company-owner',
   templateUrl: './project-show-company-owner.component.html',
   styleUrls: ['./project-show-company-owner.component.css']
})
export class ProjectShowCompanyOwnerComponent implements OnInit {



   public infosUser: UserModel = new UserModel();

   public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

   public tokenProject = '';

   public ObjetProject: ProjectModel = new ProjectModel();

  public ObjetProjectTemplate: templteProjectModel = new templteProjectModel();

   public imagesProjects: Array<ImageProjectModel> = [];

   public arrayAdressReseauxSociauxProject: Array<AdressReseauxSociauxProjectModel> = [];

   public ObjetComment: commentProjectModel = new commentProjectModel();

   public listCommentsForProject: Array<commentProjectModel> = [];


   public listeStatusProject = [
                          { key: 1, value: 'Valider le porjet' },
                          { key: 2, value: 'Terminer le porjet' },
                          { key: 3, value: 'Annuler le porjet' }
   ];

   public statutProject;

   public photoUserAdmin = './assets/img/users/user_f.png';

   public polling: any;

   public pollingComment: any;

   public page = 1;

   public pageSize = 4;

   public collectionSize = 0;

   public buttonSendDemandeInvest = false;

   public showFormFond = false;

   public showButtonAddFond = false;

   public payPalConfig?: IPayPalConfig;

   public pageBis = 1;

   public pageSizeBis = 4;

   public collectionSizeBis = 0;

   public   fondInvestor: fondInvestor = new fondInvestor();

   // tslint:disable-next-line:max-line-length
   public objectQuestionRepProject: QuestionRepProjectRequestModel = new QuestionRepProjectRequestModel();

   public listQuestionsAidesByUserForUser: Array<QuestionRepProjectModel> = [];

   public statutDemandeInvest = '';

   public ObjetDemandeInvest: InvestiteurProjectModel = new InvestiteurProjectModel();

   public listInvestor: Array<InvestiteurProjectModel> = [];

   public listFonsInvest: Array<fondInvestor> = [];

   public objectFavorisProject: FavorisProjectUserModel = new FavorisProjectUserModel();

   public objectHeartProject: HeartProjectUserModel = new HeartProjectUserModel();

   public objectLikeProject: LikeProjectUserModel = new LikeProjectUserModel();

   public objectVueProject: VueProjectUserModel = new VueProjectUserModel();

   public ipAdress = '';

   public listNewsProject: Array<NewsProjectModel> = [];

   constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
               private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
               private datePipe: DatePipe, public sanitizer: DomSanitizer, private ip: IpServiceService) {

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


               }else{

                  this.router.navigate(['/Identification']);

               }


   }

   ngOnInit(): void {

      const ObjetProject = new ProjectModel();

      ObjetProject.setUserProject(new UserModel());

      ObjetProject.setPorteProject(new PorteProjectModel());

      ObjetProject.setCategorieProject(new CategorieProjectModel());

      ObjetProject.setPorteProject(new PorteProjectModel());

      ObjetProject.setStatutProject(new StatutProjectModel());

      this.ObjetProjectTemplate.setProject(ObjetProject);


   }

   getinfosProject(tokenProject) {


      this.ngxService.start();

      const paramAction = {update: false};

      // tslint:disable-next-line:max-line-length
      this.apiService.getDataProjectForUser(this.ObjetResponseConnection, tokenProject, 'user').subscribe((dataProject: ProjectModel) => {

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

         this.checkHeartsProject(paramAction);

         this.checkFavorisProject(paramAction);

         this.checkLikeProject(paramAction);

         this.checkInvestiteurProject();

         this.getListArrayAdressReseauxSociauxProject();

         this.getListCommentsProject();

         this.getAllImageProject();

         this.getListQuestionsAides();

         this.getListInvestorByProject();

         this.getAllFondsInvest();

         this.getListNewsProject();

         this.getIP();

        /******************************************** */

      /*  this.pollingComment = setInterval(() => {

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

   getIP() {

    this.ip.getIPAddress().subscribe((res: any) => {

      console.log('infos-ip = ', res.ip) ;

      this.ipAdress =  res.ip;

      this.objectVueProject.ip_adress = res.ip;

      this.AddOrUpdateVueProject();

    });

  }



  AddOrUpdateVueProject(){

   // tslint:disable-next-line:max-line-length
   this.apiService.AddOrUpdateVueProject(this.ObjetResponseConnection, this.tokenProject, this.objectVueProject).subscribe((dataVue: VueProjectUserModel) => {

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });

  }



 checkLikeProject(paramAction){


      this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';


      this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';


      // tslint:disable-next-line:max-line-length
      this.apiService.checkLikeDislikeProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((dataLike: LikeProjectUserModel) => {

         if (dataLike){

            console.log('dataLike = ', dataLike);

            if (paramAction.update === true){

                this.updateLikeProject(paramAction, dataLike);


            }else{

                  if (dataLike.statut_like_project === 'LIKE'){

                     this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';

                  }

                  if (dataLike.statut_like_project === 'DISLIKE'){

                     this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';

                  }
            }

         }

    }, (error: any) => {

         if (paramAction.update === true){

              this.addLikeProjectForBdd(paramAction);
         }
     });


  }

  updateLikeProject(paramAction, dataLike: LikeProjectUserModel){

        // console.log('dataLike.statut_like_project =', dataLike.statut_like_project);

        // console.log('dataLike =', dataLike);

        // alert('dataLike-statut =' + dataLike.statut_like_project);

        const statutLike: string = dataLike.statut_like_project;

        if (statutLike === 'LIKE'){

             // alert('toto1');


             if (paramAction.statutLike === 'LIKE'){

                    // supprimer le like de Bdd

                     // alert('LIKE+remove');

                     this.removeLikeProjectForBdd(paramAction, dataLike);

             }

             if (paramAction.statutLike === 'DISLIKE'){

               // Mettre a jour  le like de Bdd

               // alert('DISLIKE+update');

               this.updateLikeProjectForBdd(paramAction, dataLike);

             }



        }

        if (statutLike === 'DISLIKE'){

         // alert('toto2');

         if (paramAction.statutLike === 'LIKE'){

            // Mettre a jour  le like de Bdd

            // alert('LIKE+update');

            this.updateLikeProjectForBdd(paramAction, dataLike);

         }

         if (paramAction.statutLike === 'DISLIKE'){

            // supprimer le like de Bdd

            // alert('DISLIKE+delete');

            this.removeLikeProjectForBdd(paramAction, dataLike);

         }



        }


  }

  updateLikeProjectForBdd(paramAction, dataLike: LikeProjectUserModel){


       dataLike.statut_like_project = paramAction.statutLike;

       // tslint:disable-next-line:max-line-length
       this.apiService.updateLikeProjectByUser(this.ObjetResponseConnection, this.tokenProject, dataLike).subscribe((data: LikeProjectUserModel) => {

         if (paramAction.statutLike === 'DISLIKE'){

            // Mettre a jour  le like de Bdd

            this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

            this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';

          }

         if (paramAction.statutLike === 'LIKE'){

            // Mettre a jour  le like de Bdd

            this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';

            this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

         }

         /*********************** Mettre a jour les donnes de la template projet********************************** */

         this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */




         this.ngxService.stop();

      }, (error: any) => {

        this.ngxService.stop();
      });





  }

  removeLikeProjectForBdd(paramAction, dataLike: LikeProjectUserModel){

   this.apiService.deleteLikeProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {

      if (paramAction.statutLike === 'LIKE'){

         this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

         this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

       }

      if (paramAction.statutLike === 'DISLIKE'){

         // supprimer le like de Bdd

         this.ObjetProjectTemplate.likeUsers = './assets/img/like-bis.png';

         this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike-bis.png';

      }

      /*********************** Mettre a jour les donnes de la template projet********************************** */


      this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


  }

  addLikeProjectForBdd(paramAction){


   this.objectLikeProject.statut_like_project = paramAction.statutLike;

   // tslint:disable-next-line:max-line-length
   this.apiService.addLikeProjectByUser(this.ObjetResponseConnection, this.tokenProject, this.objectLikeProject).subscribe((data: LikeProjectUserModel) => {


      if (paramAction.statutLike === 'LIKE'){

         this.ObjetProjectTemplate.likeUsers = './assets/img/like_ico.png';
      }

      if (paramAction.statutLike === 'DISLIKE'){

           this.ObjetProjectTemplate.dislikeUser = './assets/img/dislike_ico.png';
      }

      /*********************** Mettre a jour les donnes de la template projet********************************** */


      this.UpdateDataProject(this.ObjetProject.token);

       /********************************************************************************************************** */

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });



  }

   addLikeProject(){

      const paramAction = {update : true, statutLike : 'LIKE'};

      this.checkLikeProject(paramAction);



   }

   addDislikeProject(){

       const paramAction = {update : true, statutLike : 'DISLIKE'};

       this.checkLikeProject(paramAction);

   }

   addHeartProject(){

      const paramAction = {update : true};

      this.checkHeartsProject(paramAction);

   }

   addFavorisProject(){

      const paramAction = {update : true};

      this.checkFavorisProject(paramAction);

   }

   checkFavorisProject(paramAction){

      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris-bis.png';

      this.apiService.checkFavorisProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((dataFavoris: any) => {

           if (dataFavoris){

            this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris.png';

            if (paramAction.update === true){

              this.deleteFavorisProjectForBdd();

            }

           }



      }, (error: any) => {

           if (paramAction.update === true){

                this.addFavorisProjectForBdd();
           }
       });


  }

  addFavorisProjectForBdd(){

   this.ngxService.start();

   this.apiService.addProjectByMyFavoris(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris.png';

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


 }

  deleteFavorisProjectForBdd(){

   this.ngxService.start();

   this.apiService.deleteFavorisProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.srcFavorisProject = './assets/img/favoris-bis.png';

      this.ngxService.stop();

 }, (error: any) => {

   this.ngxService.stop();
 });


 }




   checkHeartsProject(paramAction){

      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon-bis.png';

      this.apiService.checkHeartProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((dataHeart: any) => {

           if (dataHeart){

            this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon.png';

            if (paramAction.update === true){

              this.deleteHeartProjectForBdd();

            }

           }



      }, (error: any) => {

           if (paramAction.update === true){

                 this.addHeartProjectForBdd();
           }
       });


  }

  addHeartProjectForBdd(){

   this.ngxService.start();

   this.apiService.addHeartProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon.png';



      this.UpdateDataProject(this.ObjetProject.token);

      this.ngxService.stop();

   }, (error: any) => {

     this.ngxService.stop();
   });


 }

  deleteHeartProjectForBdd(){

   this.ngxService.start();

   this.apiService.deleteHeartProjectByUser(this.ObjetResponseConnection, this.tokenProject).subscribe((data: any) => {


      this.ObjetProjectTemplate.heartUser = './assets/img/heart-icon-bis.png';


      this.UpdateDataProject(this.ObjetProject.token);

      this.ngxService.stop();

 }, (error: any) => {

   this.ngxService.stop();
 });


 }

   UpdateDataProject(tokenProject){

      this.apiService.getDataProjectForUser(this.ObjetResponseConnection, tokenProject, 'user').subscribe((dataPorject: ProjectModel) => {

         this.ObjetProjectTemplate.project = dataPorject;

         this.ObjetProject = dataPorject;

      }, (error: any) => { });

   }





   getListArrayAdressReseauxSociauxProject(){


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

   addFondInvestForPorject(){

      this.showFormFond = true;

   }

   checkInvestiteurProject(){


      this.apiService.checkInvestiteurProject(this.ObjetResponseConnection, this.tokenProject).subscribe((resp: any) => {

         if (!resp.success){

            this.buttonSendDemandeInvest = true;

         }else{

            this.apiService.getInfosInvestiteurProject(this.ObjetResponseConnection, this.tokenProject).subscribe((dataInvestor: any) => {

                // tslint:disable-next-line:max-line-length
             if (dataInvestor.statutDemande === 'VALIDE'  && ( dataInvestor._project._statut_project.nom === 'Valide' || dataInvestor._project._statut_project.nom === 'Renouvele')){


               this.showButtonAddFond = true;

               this.fondInvestor._investisseurProject = dataInvestor; // initialisation pour formulaire d'ajout de fonds
         }

             this.statutDemandeInvest = dataInvestor.statutDemande;


            }, (error: any) => { });


         }



       }, (error: any) => {

         this.buttonSendDemandeInvest = true;
       });


   }

   onFormSubmitAddFondByInvestor(){

       // this.saveDataTransactionPaypal(); // test

        this.initConfig();

   }



   private initConfig(): void {
      this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AST3IB2GzDWxt19bQ32sdSA8Qvki6oqZ3EEDEoz_aWbwA3AVtwzUsRu6jjoVw9ajRYthH7YbCd9hkaNC',  // compte test develop paypal
        // tslint:disable-next-line:whitespace
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        createOrderOnClient: (data) => <ICreateOrderRequest> <unknown> {
           intent: 'CAPTURE',
           purchase_units: [
              {
                 amount: {
                    currency_code: 'EUR',
                    value: this.fondInvestor.amount,
                    breakdown: {
                       item_total: {
                          currency_code: 'EUR',
                          value: this.fondInvestor.amount
                       }
                    }
                 },
                 items: [
                    {
                       name: 'fond de projet' + this.ObjetProjectTemplate.project.nom,
                       quantity: '1',
                       category: 'DIGITAL_GOODS',
                       unit_amount: {
                          currency_code: 'EUR',
                          value: this.fondInvestor.amount,
                       },
                    }
                 ]
              }
           ]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical'
        },
        onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then(details => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);

            this.saveDataTransactionPaypal();
          });
        },
        onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          // this.showSuccess = true;
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        },
      };
    }

    saveDataTransactionPaypal() {

      // tslint:disable-next-line:max-line-length
      this.apiService.saveDataTransactionPaypal(this.ObjetResponseConnection, this.tokenProject, this.fondInvestor._investisseurProject.token, this.fondInvestor).subscribe((datapay: fondInvestor) => {

        console.log('datapay', datapay);

        this.showFormFond = false;

        this.getAllFondsInvest();

      }, (error: any) => {

      });


    }

   getListInvestorByProject(){

      this.listInvestor = [];


      this.apiService.getListInvestorByProject(this.ObjetResponseConnection, this.tokenProject, 'user').subscribe((dataInvestor: any) => {

         console.log('dataInvestor', dataInvestor);

         // tslint:disable-next-line:prefer-for-of
         for (let index = 0; index < dataInvestor.length; index++) {



           if (dataInvestor[index]._userProjectInvest.photoUser === ''  ||  !dataInvestor[index]._userProjectInvest.photoUser) {

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

     getAllFondsInvest(){

      this.listFonsInvest = [];

      // tslint:disable-next-line:max-line-length
      this.apiService.getAllFondsInvestByProjectForInvestisseur(this.ObjetResponseConnection, this.tokenProject).subscribe((arrayFondsInvestor: Array<fondInvestor>) => {

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

    tinyAlert(message: string){

      Swal.fire(message);
    }

    alertConfirmation(){
      Swal.fire({
        title: 'Vous etes sure?',
        // text: 'Le changement de statut demandé sera :' + this.listeStatusProject[this.indexStatut].nom,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Je confirme l\'envoi de la demande .',
        cancelButtonText: 'J\'annule l\'action.'
      }).then((result) => {
        if (result.value) {
          this.sendDemandeInvestByApi();

        }

      });
    }

    sendDemandeInvest(){


          this.alertConfirmation();

    }

     sendDemandeInvestByApi(){


      this.apiService.sendDemandeInvestorByProject(this.ObjetResponseConnection, this.tokenProject).subscribe((dataSend: any) => {

         console.log(dataSend);

         this.tinyAlert('Votre demande a été envoyé avec succées');

         this.getAllFondsInvest();

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

      /******************************************************** */

    /*  this.apiService.getPorteProjectById(this.ObjetProject.portes_projectId).subscribe((dataPorte: any) => {

         // console.log(data);

         this.ObjetProjectTemplate.portes_project = dataPorte.nom;

      }, (error: any) => {

      }); */

      /****************************************************** */

   //   this.ObjetProjectTemplate.date_limite_collecte = this.datePipe.transform(this.ObjetProject.date_limite_collecte, 'dd-MM-yyyy');


      /******************************************************* */

    /*  this.apiService.getCategorieProject(this.ObjetProject.categorie_projectId).subscribe((dataCatgorie: any) => {

         // console.log(data);

         this.ObjetProjectTemplate.categorie_project = dataCatgorie.nom;

      }, (error: any) => {

      }); */


      /******************************************************* */

    /*  if (this.ObjetProject.statut_project === 0) {


         this.ObjetProjectTemplate.statut_project = 'Attente';

      }

      if (this.ObjetProject.statut_project === 1) {


         this.ObjetProjectTemplate.statut_project = 'Validé';

      }

      if (this.ObjetProject.statut_project === 2) {


         this.ObjetProjectTemplate.statut_project = 'Terminé';

      }

      if (this.ObjetProject.statut_project === 3) {


         this.ObjetProjectTemplate.statut_project = 'Annulé';

      } */

      /******************************************************* */

   }

   replyByPorteurProjectForInvestFor(objectquestionUser){

      const _userDest = new userDestModel();

      _userDest.token = objectquestionUser.token;

      this.objectQuestionRepProject._userDest = _userDest;

   }



   onFormSubmitQuestionForUser(){


      const date = new Date();

      const _userDest = new userDestModel();

      _userDest.token = this.ObjetProjectTemplate.project._user.token;

      this.objectQuestionRepProject._userDest = _userDest;

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


      }, (error: any) => {

      });
   }



   getListQuestionsAides() {

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

             }


         }

        //  console.log('listQuestionsAidesByUserByAdmin', this.listQuestionsAidesByUserByAdmin);


      }, (error: any) => { });


      /************************************************************************************ */

      this.listQuestionsAidesByUserForUser = this.listQuestionsAidesByUserForUser.sort((c1, c2) => c2.timestamp - c1.timestamp);


   }



}
