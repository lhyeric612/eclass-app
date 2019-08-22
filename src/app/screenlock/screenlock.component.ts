import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../config.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-screenlock',
  templateUrl: './screenlock.component.html',
  styleUrls: ['./screenlock.component.css']
})
export class ScreenlockComponent implements OnInit {

    private httpOptions: any;
    private loginData: any;
    private email: string;

    loginForm = new FormGroup({
        password: new FormControl('', [Validators.required])
    });

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private cookieService: CookieService,
        private navigationService: NavigationService
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
    }

    ngOnInit() {
        this.email = this.cookieService.get('a');
    }

    getPasswordErrorMessage() {
        return this.loginForm.controls.password.hasError('required') ? 'Please enter your password' :
                '';
    }

    changeUser() {
        this.navigationService.changeUrl('logout');
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loginForm.value.email = this.email;
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
                        this.toastr.error('Password is incorrect', 'Login Failed', {
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
