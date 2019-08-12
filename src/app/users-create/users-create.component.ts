import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import {ToastrService} from 'ngx-toastr';
import {Md5} from 'ts-md5/dist/md5';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css']
})
export class UsersCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private roles: any;

    createForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        roleId: new FormControl('', [Validators.required])
    });

    confirmPassword = new FormControl('', [Validators.required]);

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService,
        private navigationService: NavigationService,
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
            })
        };
    }

    ngOnInit() {
        this.http.get(this.configService.getRoleUrl(), this.httpOptions)
          .subscribe(roleListResponse => {
              this.roles = roleListResponse;
              this.progressMode = 'determinate';
              this.progressValue = 100;
          }, error => {
            this.router.navigateByUrl('/');
          });
    }

    back() {
        this.navigationService.back();
    }

    getEmailErrorMessage() {
        return this.createForm.controls.email.hasError('required') ? 'Please enter email address' :
            this.createForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getFirstNameErrorMessage() {
        return this.createForm.controls.firstName.hasError('required') ? 'Please enter first name' :
                '';
    }

    getLastNameErrorMessage() {
        return this.createForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getPasswordErrorMessage() {
        return this.createForm.controls.password.hasError('required') ? 'Please enter password' :
            '';
    }

    getConfirmPasswordErrorMessage() {
        return this.confirmPassword.hasError('required') ? 'Please enter confirm password' :
            '';
    }

    getRoleErrorMessage() {
        return this.createForm.controls.roleId.hasError('required') ? 'Please select role' :
            '';
    }

    onSubmit() {
        if (this.createForm.valid) {
            this.createForm.value.active = true;
            if (this.createForm.value.password === this.confirmPassword.value) {
                this.createForm.value.password = Md5.hashStr(this.createForm.value.password);
                this.http.post(this.configService.getUserUrl(), this.createForm.value, this.httpOptions)
                    .subscribe( response => {
                        this.navigationService.changeUrl('/users');
                    }, error => {
                        this.toastr.error(error.error.message, 'Error', {
                            positionClass: 'toast-top-center'
                        });
                    });
            } else {
                this.toastr.warning('Password and confirm password MUST be same.', 'Warning', {
                    positionClass: 'toast-top-center'
                });
            }
        }
    }

}
