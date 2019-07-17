import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [ ConfigService ],
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private httpOptions: any;
    private loginData: any;

    constructor(private fb: FormBuilder, private configService: ConfigService, private http: HttpClient, private toastr: ToastrService, private router: Router) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'my-auth-token'
            })
        };
    }

    ngOnInit() {

    }

    loginForm = this.fb.group({
      email: [''],
      password: ['']
    });

    onSubmit() {
        this.http.post(this.configService.getLoginUrl(), this.loginForm.value, this.httpOptions)
            .subscribe(loginResponse => {
                this.loginData = loginResponse;
                console.log(this.loginData);
                this.router.navigateByUrl('/dashboard');
            }, error => {
                console.log(error.status);
                if (error.status === 422) {
                    this.toastr.error('Email / Password is incorrect', 'Login Failed', {
                        positionClass: 'toast-top-center'
                    });
                }
            });
    }

}
