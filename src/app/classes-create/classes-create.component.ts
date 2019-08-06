import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-classes-create',
    templateUrl: './classes-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./classes-create.component.css']
})
export class ClassesCreateComponent implements OnInit {

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;

    createForm = new FormGroup({
        display_name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
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
        if (this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                }, error => {
                    // if (error.status === 401) {
                    //     this.cookieService.delete('eclass-app');
                    //     this.router.navigateByUrl('/');
                    // }
                });
        }
    }

    back() {
        this.router.navigateByUrl('/classes');
    }

    getDisplayNameErrorMessage() {
        return this.createForm.controls.display_name.hasError('required') ? 'Please enter display name' :
            '';
    }

    getCodeErrorMessage() {
        return this.createForm.controls.code.hasError('required') ? 'Please enter code' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            this.createForm.value.create_date = this.now;
            this.createForm.value.create_by = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getClassesUrl(), this.createForm.value, this.httpOptions)
                .subscribe( response => {
                    this.router.navigateByUrl('/classes');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
