import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-teachers-details',
    templateUrl: './teachers-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./teachers-details.component.css']
})
export class TeachersDetailsComponent implements OnInit {

    private routeSub: Subscription;
    private httpOptions: any;
    private teacherData: any;
    private teacherId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        gender: new FormControl(''),
        birthday: new FormControl(''),
        address: new FormControl(''),
        mobile: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteTeacherId: new FormControl('', [Validators.required])
    });

    constructor(
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService,
        private datePipe: DatePipe,
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
        if (this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                }, error => {
                    this.router.navigateByUrl('/');
                });
        }
        this.routeSub = this.route.params.subscribe(params => {
            this.teacherId = params.id;
            this.http.get(this.configService.getTeacherByIdUrl(this.teacherId), this.httpOptions)
                .subscribe(userByIdResponse => {
                    this.teacherData = userByIdResponse;
                    this.editForm.controls.firstName.setValue(this.teacherData.firstName);
                    this.editForm.controls.lastName.setValue(this.teacherData.lastName);
                    this.editForm.controls.gender.setValue(this.teacherData.gender);
                    this.editForm.controls.birthday.setValue(new Date(this.teacherData.birthday));
                    this.editForm.controls.address.setValue(this.teacherData.address);
                    this.editForm.controls.mobile.setValue(this.teacherData.mobile);
                    this.editForm.controls.email.setValue(this.teacherData.email);
                    this.editForm.controls.active.setValue(this.teacherData.active);
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        });
    }

    back() {
        this.navigationService.back();
    }

    getFirstNameErrorMessage() {
        return this.editForm.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastNameErrorMessage() {
        return this.editForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getMobileErrorMessage() {
        return this.editForm.controls.mobile.hasError('required') ? 'Please enter mobile' :
            '';
    }

    getEmailErrorMessage() {
        return this.editForm.controls.email.hasError('required') ? 'Please enter email' :
            this.editForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';
    }

    getTeacherIdErrorMessage() {
        return this.deleteForm.controls.deleteTeacherId.hasError('required') ? 'Please enter teacher id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.birthday = this.datePipe.transform(this.editForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');
            this.editForm.value.update_date = this.now;
            this.editForm.value.update_by = this.userId;
            this.http.patch(this.configService.getTeacherByIdUrl(this.teacherId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('/teachers');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteTeacherId.value === this.teacherId) {
            this.http.delete(this.configService.getTeacherByIdUrl(this.teacherId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('/teachers');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Teacher id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
