import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [ ConfigService ],
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    private httpOptions: any;
    private loginData: any;

    constructor(private fb: FormBuilder, private configService: ConfigService, private http: HttpClient) {
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
            }, error => {
                console.log(error);
            });
    }

}
