import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import {ToastrService} from 'ngx-toastr';
import {NavigationService} from '../navigation.service';

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
    private menuActive: string;
    private loginData: { password: any; email: any };
    private email: string;
    private password: string;
    private loginRes: any;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private configService: ConfigService,
        private navigationService: NavigationService
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
            })
        };
    }

    ngOnInit() {
        this.show = true;

        this.menuActive = this.router.url.split('/')[1];

        this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMeResponse => {
                this.userMeData = userMeResponse;
                this.userId = this.userMeData.id;
                this.displayName = this.userMeData.name;
                this.http.get(this.configService.getUserRoleUrl(this.userId), this.httpOptions)
                    .subscribe(userRoleResponse => {
                        this.userRoleData = userRoleResponse;
                        this.userRoleName = this.userRoleData.name;
                    }, error => {
                        this.toastr.error(error.error.message, 'Error', {
                            positionClass: 'toast-top-center'
                        });
                    });
            }, error => {
                if (this.cookieService.check('a') && this.cookieService.check('b')) {
                    this.email = this.cookieService.get('a');
                    this.password = this.cookieService.get('b');
                    this.loginData = {email: this.email, password: this.password};
                    this.http.post(this.configService.getLoginUrl(), this.loginData, this.httpOptions)
                        .subscribe(loginResponse => {
                            this.loginRes = loginResponse;
                            this.cookieService.set( 'eclass-app', this.loginRes.token);
                            this.httpOptions = {
                                headers: new HttpHeaders({
                                    'Content-Type':  'application/json',
                                    Authorization: 'Bearer ' + this.loginRes.token
                                })
                            };
                            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                                .subscribe(userMeResponse => {
                                    this.userMeData = userMeResponse;
                                    this.userId = this.userMeData.id;
                                    this.displayName = this.userMeData.name;
                                    this.http.get(this.configService.getUserRoleUrl(this.userId), this.httpOptions)
                                        .subscribe(userRoleResponse => {
                                            this.userRoleData = userRoleResponse;
                                            this.userRoleName = this.userRoleData.name;
                                        }, error2 => {
                                            this.toastr.error(error2.error.message, 'Error', {
                                                positionClass: 'toast-top-center'
                                            });
                                        });
                                }, error2 => {
                                    this.toastr.error(error2.error.message, 'Error', {
                                        positionClass: 'toast-top-center'
                                    });
                                });
                        }, error2 => {
                            this.toastr.error(error2.error.message + ' - Please login again', 'Error', {
                                positionClass: 'toast-top-center'
                            });
                            this.router.navigateByUrl('/');
                        });
                } else {
                    this.toastr.error(error.error.message + ' - Please login again1', 'Error', {
                        positionClass: 'toast-top-center'
                    });
                    this.router.navigateByUrl('/');
                }
            });
    }

    changeRoutLink(url) {
        this.navigationService.changeUrl(url);
    }

}
