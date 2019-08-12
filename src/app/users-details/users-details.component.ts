import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-users-details',
    templateUrl: './users-details.component.html',
    styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private userData: any;
    private userId: string;
    private roles: any;

    editForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        roleId: new FormControl('', [Validators.required]),
        active: new FormControl('', [Validators.required])
    });

    deleteForm = new FormGroup({
       deleteUserId: new FormControl('', [Validators.required])
    });

    constructor(
        private route: ActivatedRoute,
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
        this.routeSub = this.route.params.subscribe(params => {
            this.userId = params.id;
            this.http.get(this.configService.getUserByIdUrl(this.userId), this.httpOptions)
                .subscribe(userByIdResponse => {
                    this.userData = userByIdResponse;
                    this.editForm.controls.email.setValue(this.userData.email);
                    this.editForm.controls.firstName.setValue(this.userData.firstName);
                    this.editForm.controls.lastName.setValue(this.userData.lastName);
                    this.editForm.controls.roleId.setValue(this.userData.roleId);
                    this.editForm.controls.active.setValue(this.userData.active);
                    this.progressMode = 'determinate';
                    this.progressValue = 100;
                }, error => {
                    this.router.navigateByUrl('/');
                });
        });
        this.http.get(this.configService.getRoleUrl(), this.httpOptions)
            .subscribe(roleListResponse => {
                this.roles = roleListResponse;
            }, error => {
                this.router.navigateByUrl('/');
            });
    }

    back() {
        this.navigationService.back();
    }

    getEmailErrorMessage() {
        return this.editForm.controls.email.hasError('required') ? 'Please enter email address' :
            this.editForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getFirstNameErrorMessage() {
        return this.editForm.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastNameErrorMessage() {
        return this.editForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getRoleErrorMessage() {
        return this.editForm.controls.roleId.hasError('required') ? 'Please select role' :
            '';
    }

    getUserIdErrorMessage() {
        return this.deleteForm.controls.deleteUserId.hasError('required') ? 'Please enter user id' :
            '';
    }

    onSubmit() {
        if (this.editForm.valid) {
            this.http.patch(this.configService.getUserByIdUrl(this.userId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('/users');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteUserId.value === this.userId) {
            this.http.delete(this.configService.getUserByIdUrl(this.userId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('/users');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('User id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }
}
