import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {UserModel, ProjectModel,  ImageProjectModel, AdressReseauxSociauxProjectModel,
        commentProjectModel, StatutProjectModel, FavorisProjectUserModel,
        HeartProjectUserModel, LikeProjectUserModel, VueProjectUserModel,
        NewsProjectModel, CommissionProjectModel, MessageInterneModel,
         ResponseConnectionUserModel, ConnectionUserModel, InscriptionUserModel,
          TypeStatistiqueModel, StatutDemandeInvest} from './interfaces/models';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
  providedIn: 'root'
})

export class apiHttpSpringBootService {

  // https://json-server-growdlending.herokuapp.com

  // https://api-springboot-crowdfunding-h2.herokuapp.com/

  // http://api-spring-boot-crowdlending-api-spring-boot-crowdlending.apps.us-east-2.starter.openshift-online.com/api

  // https://spring-boot-secu-crowdfind-h2.herokuapp.com   spring-boot-security (H2-database)

 
   private apiUrlCloud = 'https://spring-boot-secu-crowdfind-h2.herokuapp.com/api';



  constructor(private http: HttpClient,  @Inject('BASE_URL') baseUrl: string) {

      console.log('BASE_URL = ', baseUrl, baseUrl.indexOf('http://localhost') );



      if (baseUrl.indexOf('http://localhost') >= 0 ){

           this.apiUrlCloud = 'http://localhost:8080/api';

      }
  }


  listAllProjectsFiltreByTagForVisitor(tag: string){

    const url = this.apiUrlCloud + '/visitor/projects/search_by_tag/' + tag;

    return this.http.get(url);

  }

  getRandomProject(){

    const url = this.apiUrlCloud + '/visitor/random_project';

    return this.http.get(url);

  }



  getCustumListCategorieProject(){

    const url = this.apiUrlCloud + '/visitor/custom_categories_project';

    return this.http.get(url);

  }

  listAllProjectsForVisitor(){

    const url = this.apiUrlCloud + '/visitor/projects';

    return this.http.get(url);

  }


  listAllProjectsTopConsulteForVisitor(){

    const url = this.apiUrlCloud + '/visitor/projects_top_consulte';

    return this.http.get(url);

  }

  listAllProjectsHeartsForVisitor(){

    const url = this.apiUrlCloud + '/visitor/projects_top_hearts';

    return this.http.get(url);

  }

  listAllProjectsLikesForVisitor(){

    const url = this.apiUrlCloud + '/visitor/projects_top_like';

    return this.http.get(url);

  }

  listAllProjectsByCategoryForVisitor(nomCategory){

    const url = this.apiUrlCloud + '/visitor/projects/' + nomCategory;

    return this.http.get(url);

  }

  listAllProjectsFiltreByTagForUser(tag: string){

    const url = this.apiUrlCloud + '/visitor/projects/search_by_tag/' + tag;

    return this.http.get(url);

  }


  public getDataUserCurrent(ObjetResponseConnection: ResponseConnectionUserModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const apiUrl = this.apiUrlCloud + '/user/me';

    return this.http.get(apiUrl, { headers: headersParam });
  }

  public getDataUser(ObjetResponseConnection: ResponseConnectionUserModel, tokenUser: string){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const apiUrl = this.apiUrlCloud + '/users/' + tokenUser;

    return this.http.post(apiUrl, {}, { headers: headersParam });
  }

  public updateProfilUser(ObjetResponseConnection, objectUpdate){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const apiUrl = this.apiUrlCloud + '/user/update_profil';

    return this.http.put(apiUrl, objectUpdate, { headers: headersParam });

   }



  public identificationUser(objectConnection: ConnectionUserModel): Observable<ResponseConnectionUserModel>{

    const  url = this.apiUrlCloud + '/auth/signin';

    return this.http.post<ResponseConnectionUserModel>(url, objectConnection);


  }

  public inscriptionUser(objectInscription: InscriptionUserModel){

    const  url = this.apiUrlCloud + '/auth/signup';

    return this.http.post(url, objectInscription);

  }

  listMyProjectByUser(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/my_projects_by_current_user';

    return this.http.post(url, {}, { headers: headersParam });

  }

  public addProjectByCompanyOwner(ObjetResponseConnection, objectProject: ProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const url = this.apiUrlCloud + '/projects/users/create_project';

    return this.http.post(url, objectProject, { headers: headersParam });

  }

  getDataProjectForVisitor(tokenProject: string){

    const url = this.apiUrlCloud + '/visitor/data_project/' + tokenProject;

    return this.http.get(url);

  }

  public updateDataProjectByUser(ObjetResponseConnection, objectProject: ProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const url = this.apiUrlCloud + '/projects/users/' + objectProject.token + '/update';

    return this.http.post(url, objectProject, { headers: headersParam });

  }

  getDataProjectForUser(ObjetResponseConnection, tokenProject: string, _type_compte: string){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    let url = '';

    if (_type_compte === 'user'){

      url = this.apiUrlCloud + '/projects/users/all_projects/' + tokenProject;

    }

    if (_type_compte === 'porteur_project'){

      url = this.apiUrlCloud + '/projects/users/my_projects_by_current_user/' + tokenProject;

    }

    return this.http.post(url, {}, { headers: headersParam });

  }

  addNewsProjectByUser(ObjetResponseConnection, tokenProject, objectNews: NewsProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/news_project/create';

    return this.http.post(url, objectNews, { headers: headersParam });


  }

  getListNewsProjectByUser(ObjetResponseConnection, tokenProject){

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/news_project';

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    return this.http.post(url, {}, { headers: headersParam });

  }

  getListArrayAdressReseauxSociauxProject(ObjetResponseConnection, tokenProject){

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/adresses_sociaux';

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    return this.http.post(url, {}, { headers: headersParam });

  }


  public addAdressReseauSocialProject(ObjetResponseConnection, tokenProject, objectAdress){

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/adresses_sociaux/create';

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    return this.http.post(url, objectAdress, { headers: headersParam });

  }

  public deleteAdressReseauSocialProject(ObjetResponseConnection, tokenProject, objectAdress: AdressReseauxSociauxProjectModel){

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/adresses_sociaux/' + objectAdress.token + '/delete';

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    return this.http.post(url, {}, { headers: headersParam });

  }

  getListQuestionReponsesBetweenManagerAndUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud +  '/projects/users/' + tokenProject + '/questions_aides_project';

    return this.http.post(url, {}, { headers: headersParam });

  }

  // tslint:disable-next-line:max-line-length
  public createQuestionReponses(ObjetResponseConnection, tokenProject, _questionRepProjectRequest){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud +  '/projects/users/' + tokenProject + '/questions_aides_project/create';

    return this.http.post(url, _questionRepProjectRequest, { headers: headersParam });

  }

  public addCommentProject(ObjetResponseConnection, tokenProject, objectComment){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/comments/create';

    return this.http.post(url, objectComment, { headers: headersParam });

  }

  getListArrayCommentsProject(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/comments';

    return this.http.post(url, {}, { headers: headersParam });

  }

  public addImageProject(ObjetResponseConnection, tokenProject, objectImage: ImageProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/links_images/create';

    return this.http.post(url, objectImage, { headers: headersParam });
  }

  public deleteImageProject(ObjetResponseConnection, tokenProject, objectImage: ImageProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/links_images/' + objectImage.token + '/delete';

    return this.http.post(url, {}, { headers: headersParam });

  }

  getAllImagesByIdProject(ObjetResponseConnection, tokenProject){


    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/links_images';

    return this.http.post(url, {}, { headers: headersParam });
  }



  public getStatistiquesHeartsChartsByUser(ObjetResponseConnection, tokenProject, _typeStat: TypeStatistiqueModel){


    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/stat_hearts_project';

    return this.http.post(url, _typeStat, { headers: headersParam });

  }

  public getStatistiquesVuesChartsByUser(ObjetResponseConnection, tokenProject, _typeStat: TypeStatistiqueModel){


    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/stat_vues_project';

    return this.http.post(url, _typeStat, { headers: headersParam });

  }

  public getStatistiquesLikesChartsByUser(ObjetResponseConnection, tokenProject, _typeStat: TypeStatistiqueModel){


    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/stat_likes_project';

    return this.http.post(url, _typeStat, { headers: headersParam });

  }


  public getStatistiquesDislikesChartsByUser(ObjetResponseConnection, tokenProject, _typeStat: TypeStatistiqueModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/stat_dislikes_project';

    return this.http.post(url, _typeStat, { headers: headersParam });

  }

  listAllProjectByUser(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/all_projects_by_current_user';

    return this.http.post(url, {}, { headers: headersParam });

  }

  getListCategorieProject(){

    const url = this.apiUrlCloud + '/visitor/all_categories_project';

    return this.http.get(url);

  }

  getListStatutProject(){

    const url = this.apiUrlCloud + '/visitor/all_status_project';

    return this.http.get(url);

  }

  getListPorteProject(){

    const url = this.apiUrlCloud + '/visitor/all_portes_project';

    return this.http.get(url);

  }



  getListInvestorByProject(ObjetResponseConnection, tokenProject, _type_user){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    let url = '';

    if (_type_user === 'user'){

       url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project_for_user';

    }

    if (_type_user === 'porteur_project'){

       url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project_for_porteur';

    }

    return this.http.post(url, {}, { headers: headersParam });

  }

  checkInvestiteurProject(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/check_invest_project';

    return this.http.post(url, {}, { headers: headersParam });

  }

  getInfosInvestiteurProject(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/get_infos_invest_project';

    return this.http.post(url, {}, { headers: headersParam });

  }

  sendDemandeInvestorByProject(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/create_demande_invest';

    return this.http.post(url, {}, { headers: headersParam });

  }

  updateDemandeInvestorByProject(ObjetResponseConnection, tokenProject, token_demande, _statutDemandeInvest: StatutDemandeInvest){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/' + token_demande + '/update_demande_invest';

    return this.http.post(url, _statutDemandeInvest, { headers: headersParam });

  }


  saveDataTransactionPaypal(ObjetResponseConnection, tokenProject, token_demande, _fondInvestisment){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/' + token_demande + '/fonds_invest_project/create';

    return this.http.post(url, _fondInvestisment, { headers: headersParam });


  }

  getAllFondsInvestByProjectForInvestisseur(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/log_fonds_invest_project_for_investisseur';

    return this.http.post(url, {}, { headers: headersParam });


  }

  getAllFondsInvestByProjectForPorteurProject(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    // tslint:disable-next-line:max-line-length
    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/investisseurs_project/log_fonds_invest_project_for_porteur_project';

    return this.http.post(url, {}, { headers: headersParam });


  }

  public addProjectByMyFavoris(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/favoris_projects/create';

    return this.http.post(url, {}, { headers: headersParam });


  }

  checkFavorisProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/favoris_projects/check';

    return this.http.post(url, {}, { headers: headersParam });
  }

  deleteFavorisProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/favoris_projects/delete';

    return this.http.post(url, {}, { headers: headersParam });

  }

  listAllFavorisProjectByUser(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/favoris_projects';

    return this.http.post(url, {}, { headers: headersParam });

  }

  checkHeartProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/hearts_project/check';

    return this.http.post(url, {}, { headers: headersParam });

  }

  addHeartProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/hearts_project/create';

    return this.http.post(url, {}, { headers: headersParam });

  }

  deleteHeartProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/hearts_project/delete';

    return this.http.post(url, {}, { headers: headersParam });

  }

  checkLikeDislikeProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/like_dislike_project/check';

    return this.http.post(url, {}, { headers: headersParam });
  }


  addLikeProjectByUser(ObjetResponseConnection, tokenProject, objectLikeProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/like_dislike_project/create';

    return this.http.post(url, objectLikeProject, { headers: headersParam });

  }

  updateLikeProjectByUser(ObjetResponseConnection, tokenProject, objectLikeProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/like_dislike_project/update';

    return this.http.post(url, objectLikeProject, { headers: headersParam });

  }

  deleteLikeProjectByUser(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/like_dislike_project/delete';

    return this.http.post(url, {}, { headers: headersParam });

  }

  AddOrUpdateVueProject(ObjetResponseConnection, tokenProject, objectVueProject: VueProjectUserModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/' + tokenProject + '/vues_project/create_or_update';

    return this.http.post(url, objectVueProject, { headers: headersParam });

  }

  listMyContribProjectByUser(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/users/my_projects_invest';

    return this.http.post(url, {}, { headers: headersParam });

  }

  public updateDataProjectByManager(ObjetResponseConnection, tokenProject, tokenStatut){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/manager/' +  tokenProject + '/update_statut_project/' + tokenStatut;


    return this.http.post(url, {}, { headers: headersParam });

  }

  public checkCommissionProjectByManager(ObjetResponseConnection, tokenProject){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });

    const url = this.apiUrlCloud + '/projects/manager/' +  tokenProject + '/check_commission_project/';


    return this.http.post(url, {}, { headers: headersParam });
  }

  public addCommissionProjectByManager(ObjetResponseConnection, tokenProject, objectCommissionProject: CommissionProjectModel){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const  url = this.apiUrlCloud + '/projects/manager/'  + tokenProject + '/list_commission_project/create';

    return this.http.post(url, objectCommissionProject, { headers: headersParam });

  }

  getListUsers(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const  url = this.apiUrlCloud + '/listing_users';

    return this.http.post(url, {}, { headers: headersParam });

  }

  public getStatistiquesNewUsersChartsByManager(ObjetResponseConnection){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const  url = this.apiUrlCloud + '/stat_users';

    return this.http.post(url, {}, { headers: headersParam });


  }

  public listMyProjectByUserByManager(ObjetResponseConnection, tokenUser){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const  url = this.apiUrlCloud + '/projects/users/' + tokenUser + '/all_projects' ;

    return this.http.post(url, {}, { headers: headersParam });

  }

  public listContribProjectByUserByManager(ObjetResponseConnection, tokenUser){

    const headersParam = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ObjetResponseConnection.accessToken}`
    });


    const  url = this.apiUrlCloud + '/projects/users/' + tokenUser + '/all_contrib_projects';

    return this.http.post(url, {}, { headers: headersParam });

  }

                            /************************************************************************************** */

  public checkConfirmationInscription(token){

    const  url = this.apiUrlCloud + '/users/checkConfirmationInscription/' + token;

    return this.http.post(url, token);

  }


  public sendFormContact(objectContact){

    const  url = this.apiUrlCloud + '/visitor/createMessageContact';

    return this.http.post(url, objectContact);
  }




  getListMessagesRecusByUser(objectUser: UserModel){

    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/messages_recus/all';

    return this.http.post(url, objectUser);

  }

  getListMessagesEnvoyesByUser(objectUser: UserModel){

    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/messages_envoyes/all';

    return this.http.post(url, objectUser);

  }


  getListMessagesNonLus(objectUser: UserModel){

    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/list_messages_non_lus';

    return this.http.post(url, objectUser);

  }

  countListMessagesNonLus(objectUser: UserModel){

    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/count_messages_non_lus';

    return this.http.post(url, objectUser);

  }

  getDataMessageInterne(objectUser: UserModel, tokenMessage){


    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/messages/' + tokenMessage;

    return this.http.post(url, objectUser);

  }

  updateDataMessageInterne(objectUser: UserModel, objectMessage: MessageInterneModel ){


    const url = this.apiUrlCloud + '/users/' + objectUser.token + '/messages/' + objectMessage.token + '/update';

    return this.http.post(url, objectMessage);
  }


}
