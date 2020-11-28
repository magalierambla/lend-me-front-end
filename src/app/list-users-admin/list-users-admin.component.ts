import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

import { UserModel, StatistiquesChartsUsersModel, ResponseConnectionUserModel } from '../interfaces/models';

@Component({
  selector: 'app-list-users-admin',
  templateUrl: './list-users-admin.component.html',
  styleUrls: ['./list-users-admin.component.css']
})
export class ListUsersAdminComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public ObjetResponseConnection: ResponseConnectionUserModel = new ResponseConnectionUserModel();

  public users: Array<UserModel> = [];

  public page = 1;

  public pageSize = 4;

  public collectionSize = 0;

  /************** Config Bar charts*********************** */

  barChartOptions: ChartOptions = {
                                   responsive: true,
             };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [  { data: [], label: 'Nombre de nouveaux utilisateurs' } ];


  /**************************************************************** */


  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Nombre de nouveaux utilisateurs' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';



  /********************************************************************* */

 /* doughnutChartLabels: Label[] = ['BMW', 'Ford', 'Tesla'];
  doughnutChartData: MultiDataSet = [
    [55, 25, 20]
  ];*/

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [ [] ];
  doughnutChartType: ChartType = 'doughnut';


   /********************************************************************* */




      /********************************************************************* */


  constructor(private router: Router, private cookie: CookieService, private apiService: apiHttpSpringBootService,
              private ngxService: NgxUiLoaderService, private datePipe: DatePipe) {

       if (this.cookie.get('infosUser')  &&  this.cookie.get('ObjetResponseConnection')) {

                  this.infosUser = JSON.parse(this.cookie.get('infosUser'));

                  this.ObjetResponseConnection = JSON.parse(this.cookie.get('ObjetResponseConnection'));


                  console.log('this.infosUser-admin', this.infosUser);

                  if (this.infosUser.photoUser === '' || !this.infosUser.photoUser) {

                    if (this.infosUser.sex === 'F') {

                      this.infosUser.photoUser = './assets/img/users/user_f.png';


                    }

                    if (this.infosUser.sex === 'H') {

                      this.infosUser.photoUser = './assets/img/users/user_m.png';


                    }
              }



    } else {

      this.router.navigate(['/admin-login']);
    }

  }

  ngOnInit(): void {

       this.getListUsers();

       this.getStatistiquesUsers();

   }

   getStatistiquesUsers(){

       // tslint:disable-next-line:max-line-length
       this.apiService.getStatistiquesNewUsersChartsByManager(this.ObjetResponseConnection).subscribe((dataUsers: Array<StatistiquesChartsUsersModel>) => {

        dataUsers.forEach(element => {

               console.log(element);

               /*********************************************** */

               this.barChartData[0].data.push(element.nbrUsers);

               this.barChartLabels.push(element.year);


               /*********************************************** */

               this.lineChartData[0].data.push(element.nbrUsers);

               this.lineChartLabels.push(element.year);


               /*********************************************** */

               this.doughnutChartData[0].push(element.nbrUsers);

               this.doughnutChartLabels.push(element.year);

              /*********************************************** */


        });



      }, (error: any) => { });

   }

  getListUsers() {

    this.users = [];

    this.ngxService.start();

    this.apiService.getListUsers(this.ObjetResponseConnection).subscribe((dataUsers: Array<UserModel>) => {

      console.log('dataUsers', dataUsers);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < dataUsers.length; index++) {



        if (dataUsers[index].photoUser === '' || !dataUsers[index].photoUser) {

          if (dataUsers[index].sex === 'F') {

            dataUsers[index].photoUser = './assets/img/users/user_f.png';


          }

          if (dataUsers[index].sex === 'H') {

            dataUsers[index].photoUser = './assets/img/users/user_m.png';


          }

        }

        dataUsers[index].createdAt = this.datePipe.transform(dataUsers[index].createdAt, 'dd-MM-yyyy  H:m');

        this.users.push(dataUsers[index]);

      }


      this.ngxService.stop();

    }, (error: any) => { });

    this.ngxService.stop();
  }

}
