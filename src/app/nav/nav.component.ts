import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    private httpOptions: any;
    private show: boolean;
    private userId: string;
    private displayName: string;
    private userRoleName: string;
    private userMeData: any;
    private userRoleData: any;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router,
        private configService: ConfigService
    ) {
        if (this.cookieService.check('eclass-app')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        }
    }

  ngOnInit() {
      this.show = true;
      if (this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                    this.displayName = this.userMeData.name;
                    this.http.get(this.configService.getUserRoleUrl(this.userId), this.httpOptions)
                        .subscribe(userRoleResponse => {
                            this.userRoleData = userRoleResponse;
                            this.userRoleName = this.userRoleData.name;
                        }, error => {
                            console.log(error);
                        });
                }, error => {
                    if (error.status === 401) {
                        this.cookieService.delete('eclass-app');
                        this.router.navigateByUrl('/');
                    }
                });
        }
  }

}
