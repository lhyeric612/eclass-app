import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-parents-create',
    templateUrl: './parents-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./parents-create.component.css']
})
export class ParentsCreateComponent implements OnInit {

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;

    numbers = [
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
        {label: '6', value: 6},
        {label: '7', value: 7},
        {label: '8', value: 8},
        {label: '9', value: 9},
        {label: '10', value: 10}
        ];

    createForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        nickName: new FormControl(''),
        chineseName: new FormControl(''),
        gender: new FormControl(''),
        birthday: new FormControl(''),
        address: new FormControl(''),
        mobile: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        studentCount: new FormControl('', [Validators.required]),
    });

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService,
        private datePipe: DatePipe
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
            })
        };
    }

    ngOnInit() {
        this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMenResponse => {
                this.userMeData = userMenResponse;
                this.userId = this.userMeData.id;
            }, error => {
                console.log(error);
                this.toastr.error(error.error.message, 'Error', {
                    positionClass: 'toast-top-center'
                });
            });
    }

    back() {
        this.router.navigateByUrl('/parents');
    }

    getFirstNameErrorMessage() {
        return this.createForm.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastNameErrorMessage() {
        return this.createForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getMobileErrorMessage() {
        return this.createForm.controls.mobile.hasError('required') ? 'Please enter mobile' :
            '';
    }

    getEmailErrorMessage() {
        return this.createForm.controls.email.hasError('required') ? 'Please enter email' :
            this.createForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getStudentCountErrorMessage() {
        return this.createForm.controls.studentCount.hasError('required') ? 'Please select number of students' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            this.createForm.value.birthday = this.datePipe.transform(this.createForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');
            this.createForm.value.studentCreatedCount = 0;
            this.createForm.value.create_date = this.now;
            this.createForm.value.create_by = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getParentsUrl(), this.createForm.value, this.httpOptions)
                .subscribe( response => {
                    this.router.navigateByUrl('/parents');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}