import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css']
})
export class UsersCreateComponent implements OnInit {

    private httpOptions: any;
    private roles: any;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private router: Router,
        private configService: ConfigService
    ) {
        if(this.cookieService.check('eclass-app')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        }
    }

    createForm = this.formBuilder.group({
        email: [''],
        firstName: [''],
        lastName: [''],
        password: [''],
        confirmPassword: [''],
        roleId: [''],
    });

    ngOnInit() {
        this.http.get(this.configService.getRoleUrl(), this.httpOptions)
          .subscribe(roleListResponse => {
              this.roles = roleListResponse;
          }, error => {
              console.log(error);
          });
    }

    onSubmit() {
        console.log(this.createForm.value);
    }

}
