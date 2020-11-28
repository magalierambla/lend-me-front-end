import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute} from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import {UserModel} from '../interfaces/models';
import { IpServiceService } from './../ip-service.service';

@Component({
  selector: 'app-confirm-inscription-user',
  templateUrl: './confirm-inscription-user.component.html',
  styleUrls: ['./confirm-inscription-user.component.css']
})
export class ConfirmInscriptionUserComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public compteIsActive = false;

  constructor(private router: Router, private route: ActivatedRoute, private cookie: CookieService,
              private apiService: apiHttpSpringBootService, private ngxService: NgxUiLoaderService,
              private datePipe: DatePipe, private ip: IpServiceService) {

                this.route.params.subscribe(params => {

                  // alert(params.token);

                  this.checkConfirmationInscription(params.token);

               });

               }

  ngOnInit(): void {  }

  checkConfirmationInscription(token){

        this.ngxService.start();

        this.apiService.checkConfirmationInscription(token).subscribe((dataUser: UserModel) => {


          this.infosUser = dataUser;

          this.cookie.set('infosUser', JSON.stringify(this.infosUser));

          this.compteIsActive = true;

          // this.router.navigate(['/profilUser']);


      }, (error: any) => {        

      });

        this.ngxService.stop();


  }

}
