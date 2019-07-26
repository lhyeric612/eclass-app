import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../config.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private httpOptions: any;
    private hidePwd: boolean;
    private loginData: any;

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private cookieService: CookieService
    ) {
        if (this.cookieService.check('eclass-app')) {
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
        this.hidePwd = true;
        if (this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    if (userMenResponse) {
                        this.router.navigateByUrl('/dashboard');
                    }
                }, error => {
                    if (error.status === 401) {
                        this.cookieService.delete('eclass-app');
                    }
                });
        }
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
                    // this.cookieService.set('a', this.loginForm.value.email);
                    // this.cookieService.set('b', this.loginForm.value.password);
                    this.cookieService.set( 'eclass-app', this.loginData.token );
                    this.router.navigateByUrl('/dashboard');
                }, error => {
                    if (error.status === 401 || error.status === 404 || error.status === 422) {
                        this.toastr.error('Email / Password is incorrect', 'Login Failed', {
                            positionClass: 'toast-top-center'
                        });
                    }
                });
        }
    }
}
