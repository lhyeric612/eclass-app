import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router,
        private configService: ConfigService
    ) {
        library.add(faBars);
        if(this.cookieService.check('eclass-app')) {
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
                    this.userId = userMenResponse.id;
                    this.displayName = userMenResponse.name;
                    this.http.get(this.configService.getUserRoleUrl(this.userId), this.httpOptions)
                        .subscribe(userRoleResponse => {
                            this.userRoleName = userRoleResponse.name;
                        }, error => {
                            console.log(error);
                        });
                }, error => {
                    if(error.status === 401) {
                        this.cookieService.delete('eclass-app');
                        this.router.navigateByUrl('/');
                    }
                });
        }
  }

}
