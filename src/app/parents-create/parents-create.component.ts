import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-parents-create',
    templateUrl: './parents-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./parents-create.component.css']
})
export class ParentsCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;

    createForm = new FormGroup({
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
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('parents/create');
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

    getMobileErrorMessage() {
        return this.createForm.controls.mobile.hasError('required') ? 'Please enter mobile' :
            this.createForm.controls.mobile.hasError('maxlength') || this.createForm.controls.mobile.hasError('minlength') ? 'mobile number must be 8 digits' :
            '';
    }

    getEmailErrorMessage() {
        return this.createForm.controls.email.hasError('required') ? 'Please enter email' :
            this.createForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            console.log(this.createForm.value.birthday);
            if (this.createForm.value.birthday != "") {
                this.createForm.value.birthday = this.datePipe.transform(this.createForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');
            }
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getParentsUrl(), this.createForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('parents');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
