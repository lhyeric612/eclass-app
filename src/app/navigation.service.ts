import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router, NavigationEnd} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
    private httpOptions: any;
    private token: string;
    private email: string;
    private password: string;
    private loginData: { password: string; email: string };
    private loginRes: any;
    private currentUrl: string;
    private previousUrl: string;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService,
        private toastr: ToastrService,
    ) {
        this.currentUrl = this.router.url;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              this.previousUrl = this.currentUrl;
              this.currentUrl = event.url;
            }
          });
    }

    private getPreviousUrl() {
        return this.previousUrl;
    }

    public back() {
        this.changeUrl(this.getPreviousUrl());
    }

    public changeUrl(url) {
        this.token = (this.cookieService.check('eclass-app')) ? this.cookieService.get('eclass-app') : '';
        this.email = (this.cookieService.check('a')) ? this.cookieService.get('a') : '';
        this.password = (this.cookieService.check('b')) ? this.cookieService.get('b') : '';
        if (this.token) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.token
                })
            };
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMeResponse => {
                    this.router.navigateByUrl('/' + url);
                }, error => {
                    console.log(error);
                    if (this.cookieService.check('a') && this.cookieService.check('b')) {
                        this.loginData = {email: this.email, password: this.password};
                        this.http.post(this.configService.getLoginUrl(), this.loginData, this.httpOptions)
                            .subscribe(loginResponse => {
                                this.loginRes = loginResponse;
                                this.cookieService.set( 'eclass-app', this.loginRes.token);
                                this.router.navigateByUrl('/' + url);
                            }, error2 => {
                                this.toastr.error(error2.error.message + ' - Please login again', 'Error', {
                                    positionClass: 'toast-top-center'
                                });
                                this.router.navigateByUrl('/');
                            });
                    } else {
                        this.toastr.error(error.error.message + ' - Please login again', 'Error', {
                            positionClass: 'toast-top-center'
                        });
                        this.router.navigateByUrl('/');
                    }
                });
        } else {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json'
                })
            };
            if (this.cookieService.check('a') && this.cookieService.check('b')) {
                this.loginData = {email: this.email, password: this.password};
                this.http.post(this.configService.getLoginUrl(), this.loginData, this.httpOptions)
                    .subscribe(loginResponse => {
                        this.loginRes = loginResponse;
                        this.cookieService.set( 'eclass-app', this.loginRes.token);
                        this.router.navigateByUrl('/' + url);
                    }, error => {
                        this.toastr.error(error.error.message + ' - Please login again', 'Error', {
                            positionClass: 'toast-top-center'
                        });
                        this.router.navigateByUrl('/');
                    });
            } else {
                this.toastr.error(' - Please login again', 'Error', {
                    positionClass: 'toast-top-center'
                });
                this.router.navigateByUrl('/');
            }
        }
    }
}
