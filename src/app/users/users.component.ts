import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
// import { library } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    private httpOptions: any;
    private userList: any;
    private noRecord: boolean;

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
        this.noRecord = true;

        if (!this.cookieService.check('eclass-app')) {
            this.router.navigateByUrl('/');
        }

        this.http.get(this.configService.getUserListUrl(), this.httpOptions)
            .subscribe(userListResponse => {
                this.userList = userListResponse;
                if (this.userList.length > 0) {
                    this.noRecord = false;
                    for (const userData of this.userList) {
                        this.http.get(this.configService.getUserRoleUrl(userData.id), this.httpOptions)
                            .subscribe( userRoleResponse => {
                                userData.roleName = userRoleResponse.name;
                            }, error => {
                                console.log(error);
                            });
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    create() {
        this.router.navigateByUrl('/users/create');
    }

}
