/******************************************************************** */

export class InscriptionUserModel {
  name: string;
  prenom: string;
  username: string;
  sex: string;
  date_naissance: string;
  email: string;
  password: string;
}

export class ConnectionUserModel {
  usernameOrEmail: string;
  password: string;
}

export class ResponseConnectionUserModel {
  accessToken: string;
  tokenType: string;
}

export class UserUpdateProfilRequest{

  name: string;
  prenom: string;
  photo_user: string;
  username: string;
  sex: string;
  email: string;
  password: string;
}

export class RoleModel {
  id: string;
  name: string;
}


export class UserModel {
  createdAt?: string;
  name: string;
  prenom: string;
  photoUser: string;
  token?: string;
  date_naissance?: string;
  nbr_projects: number;
  username: string;
  sex: string;
  typeCompte?: string;
  email?: string;
  password?: string;
  roles: Array<RoleModel>;

  UserModel(){

     this.roles = [];

  }
}


export class templteProjectModel {
  project: ProjectModel;
  nbrJours: string;
  dateCreatedFormate: string;
  dateLimiteCollecteFormate: string;
  favorisProject: number;
  srcFavorisProject: string;
  heartUser: string;
  likeUsers: string;
  dislikeUser: string;
  tauxFinance: number;

  getProject(): ProjectModel{

     return this.project;

  }

  setProject(newProject: ProjectModel): void{

         this.project = newProject;

   }
}


export class ProjectModel {
  created_at: string;
  nom: string;
  description: string;
  montant_minimun: number;
  date_limite_collecte: string;
  token: string;
  total_fonds?: number;
  total_favoris?: number;
  total_hearts?: number;
  total_vues?: number;
  total_comments?: number;
  total_investisseurs?: number;
  total_like?: number;
  total_dislike?: number;
  _user?: UserModel;
  _comments: Array<CommentProjectModel>;
  _news_project: Array<NewsProjectModel>;
  _links_images: Array<ImageProjectModel>;
  _adress_sociaux_project: Array<AdressReseauxSociauxProjectModel>;
  contrePartieProject: string;
  afficheProject: string;
  _statut_project: StatutProjectModel;
  _porte_project: PorteProjectModel;
  categoryProject: CategorieProjectModel;
 // adressReseauxSociauxProject: AdressReseauxSociauxProjectModel;
  manager_project?: UserModel;

  setPorteProject(newPorteProject: PorteProjectModel): void{

    this._porte_project = newPorteProject;

  }
  setCategorieProject(newCategorieProject: CategorieProjectModel): void{

    this.categoryProject = newCategorieProject;

  }
  setStatutProject(newStatutProject: StatutProjectModel): void{

    this._statut_project = newStatutProject;

  }

  setUserProject(newUser: UserModel): void{

    this._user = newUser;

  }
}

export class ImageProjectModel {
  token: string;
  link: string;

  ImageProjectModel(){

     this.token = '';

     this.link = '';

  }
}

export class LinkProjectModel {
  token: string;
  link: string;
}

export class NewsProjectModel {
  token?: string;
  date_created: string;
  titre: string;
  description: string;
  photos: string;
  timestamp: number;
}


export class CommentProjectModel {
  token: string;
  bodyComment: string;
  dateCreated: string;
  timestamp: number;
  user: UserModel;
}

export class AdressReseauxSociauxProjectModel {
  token: string;
  keyMedia: string;
  valueMedia: string;
  linkProject: string;
}

export class CategorieProjectModel {
  token: string;
  nom: string;
  nbr_projects: number;

  CategorieProjectModel(){

     this.token = '';
     this.nom = '';
     this.nbr_projects = 0;
  }

}

export class StatutProjectModel {
  token: string;
  nom: string;
}

export class PorteProjectModel {
  id: number;
  nom: string;
}


export class QuestionRepProjectModel {
  id: number;
  bodyAide: string;
  dateCreated: string;
  timestamp: number;
  _userExp: UserModel;
  _userDest: UserModel;
  _project: ProjectModel;
}

export class userDestModel {
    token: string;
  }

export class QuestionRepProjectRequestModel {
  bodyAide: string;
  dateCreated: string;
  timestamp: number;
  _userDest?: userDestModel;
  _userExp?: userDestModel;
}

export class commentProjectRequestModel {
  bodyComment: string;
  dateCreated: string;
  timestamp: number;
}


export class commentProjectModel {
  id: number;
  bodyComment: string;
  dateCreated: string;
  timestamp: number;
  user: UserModel;
  
}


export class StatistiquesChartsHeartModel {
  year: number;
  nbrHearts: number;
  month: string;
  day: string;
}

export class StatistiquesChartsVueModel {
  year: number;
  nbrVues: number;
  month: string;
  day: string;
}

export class StatistiquesChartsLikeModel {
  year: number;
  nbrLikes: number;
  month: string;
  day: string;
}

export class StatistiquesChartsDislikesModel {
  year: number;
  nbrDislikes: number;
  month: string;
  day: string;
}

export class TypeStatistiqueModel {
  year: string;
  month: string;
  type_statistique: string;
}

export class InvestiteurProjectModel {
  id?: number;
  date_created: string;
  date_update: string;
  token?: string;
  timestamp: number;
  total_fonds: number;
  statutDemande?: string;
  _project: ProjectModel;
  _userProjectInvest: UserModel;
}

export class StatutDemandeInvest {

    statut_demande: string;
}



export class fondInvestor {
  id?: number;
  token?: string;
  amount: number;
  dateCreated?: string;
  timestamp?: number;
  _project?: ProjectModel;
  _user?: UserModel;
  _investisseurProject?: InvestiteurProjectModel;
}

export class FavorisProjectUserModel {
  id: number;
  date_created: string;
  timestamp: number;
  token: string;
  _project: ProjectModel;
  _user: UserModel;
}

export class HeartProjectUserModel {
  id: number;
  date_created: string;
  created_at?: string;
  timestamp: number;
  _project: ProjectModel;
  _user: UserModel;
}


export class VueProjectUserModel {
  id?: number;
  date_created?: string;
  date_update?: string;
  date_consultation?: string;
  timestamp?: number;
  ip_adress: string;
  _project?: ProjectModel;
  _user?: UserModel;
}
export class LikeProjectUserModel {
  id?: number;
  date_created?: string;
  created_at?: string;
  date_update?: string;
  timestamp?: number;
  statut_like_project: string;
  _project?: ProjectModel;
  _user?: UserModel;
}

export class StatistiquesChartsUsersModel {
  year: string;
  nbrUsers: number;
}

export class CommissionProjectModel {
  id?: number;
  amount: number;
  token?: string;
  date_created: string;
  timestamp: number;
  created_at?: string;
  _project?: ProjectModel; 
}


/********************************************************************** */





export class FormContactModel {
  id: number;
  token: string;
  email: string;
  date_created: string;
  date_read: string;
  timestamp_created: number;
  timestamp_read: number;
  sujet: string;
  description: string;
  statut_read: number;
}

export class MessageInterneModel {
  id: number;
  token: string;
  bodyMessage: string;
  dateCreated: string;
  timestamp: number;
  _tokenProject: string;
  _nomUserExp: string;
  _nomUserDest: string;
  _photoUserExp: string;
  _photoUserDest: string;
  _tokenUserExp: string;
  _tokenUserDest: string;
  statutExp: string;
  statutDest: string;
  timestampConsultation: number;
  dateConsultation: string;
}


