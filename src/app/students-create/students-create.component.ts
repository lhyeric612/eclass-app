import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-students-create',
    templateUrl: './students-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./students-create.component.css']
})
export class StudentsCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;
    private parents: any;

    createForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        nickName: new FormControl(''),
        chineseName: new FormControl(''),
        gender: new FormControl(''),
        birthday: new FormControl('', [Validators.required]),
        parentsId: new FormControl('', [Validators.required])
    });

    createForm2 = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        nickName: new FormControl(''),
        chineseName: new FormControl(''),
        gender: new FormControl(''),
        birthday: new FormControl(''),
        address: new FormControl(''),
        mobile: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
        email: new FormControl('', [Validators.required, Validators.email])
    });

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
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
        this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMenResponse => {
                this.userMeData = userMenResponse;
                this.userId = this.userMeData.id;
                this.http.get(this.configService.getParentsUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.parents = response;
                        if (this.parents.length > 0) {
                            for (const parent of this.parents) {
                                parent.name = parent.firstName + ' ' + parent.lastName;
                            }
                        }
                        this.parents.push({ id: "0", name: "No parent in system" });
                    }, error => {
                        this.navigationService.changeUrl('students/create');
                    });
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('students/create');
            });
    }

    back() {
        this.navigationService.back();
    }

    getFirstNameErrorMessage() {
        return this.createForm.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastNameErrorMessage() {
        return this.createForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getParentErrorMessage() {
        return this.createForm.controls.parentsId.hasError('required') ? 'Please select parent' :
            '';
    }

    getFirstName2ErrorMessage() {
        return this.createForm2.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastName2ErrorMessage() {
        return this.createForm2.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getMobileErrorMessage() {
        return this.createForm2.controls.mobile.hasError('required') ? 'Please enter mobile' :
            this.createForm2.controls.mobile.hasError('maxlength') || this.createForm.controls.mobile.hasError('minlength') ? 'mobile number must be 8 digits' :
            '';
    }

    getEmailErrorMessage() {
        return this.createForm2.controls.email.hasError('required') ? 'Please enter email' :
            this.createForm2.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            if (this.createForm.value.birthday != "") {
                this.createForm.value.birthday = this.datePipe.transform(this.createForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');    
            }
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getStudentsUrl(), this.createForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('students');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
