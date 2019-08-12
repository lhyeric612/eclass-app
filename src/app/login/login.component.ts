import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {ConfigService} from '../config.service';
import {Md5} from 'ts-md5/dist/md5';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private httpOptions: any;
    private loginData: any;

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private cookieService: CookieService,
        private navigationService: NavigationService
    ) {
        if (this.cookieService.check('eclass-app') && this.cookieService.check('a') && this.cookieService.check('b')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        } else {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json'
                })
            };
        }
    }

    ngOnInit() {
        this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    if (userMenResponse) {
                        this.navigationService.changeUrl('dashboard');
                    }
                }, error => {
                        this.cookieService.delete('eclass-app');
                        this.cookieService.delete('a');
                        this.cookieService.delete('b');
                });
    }

    getEmailErrorMessage() {
        return this.loginForm.controls.email.hasError('required') ? 'Please enter your login email' :
            this.loginForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getPasswordErrorMessage() {
        return this.loginForm.controls.password.hasError('required') ? 'Please enter your password' :
                '';
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loginForm.value.password = Md5.hashStr(this.loginForm.value.password);

            this.http.post(this.configService.getLoginUrl(), this.loginForm.value, this.httpOptions)
                .subscribe(loginResponse => {
                    this.loginData = loginResponse;
                    this.cookieService.set('a', this.loginForm.value.email);
                    this.cookieService.set('b', this.loginForm.value.password);
                    this.cookieService.set('eclass-app', this.loginData.token);
                    this.navigationService.changeUrl('dashboard');
                }, error => {
                    if (error.status === 401 || error.status === 404 || error.status === 422) {
                        this.toastr.error('Email / Password is incorrect', 'Login Failed', {
                            positionClass: 'toast-top-center'
                        });
                    } else {
                        this.toastr.error(error.error.message, 'Error', {
                            positionClass: 'toast-top-center'
                        });
                    }
                });
        }
    }
}
