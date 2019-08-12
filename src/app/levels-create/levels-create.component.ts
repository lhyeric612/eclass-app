import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-levels-create',
    templateUrl: './levels-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./levels-create.component.css']
})
export class LevelsCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;

    createForm = new FormGroup({
        displayName: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
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
                this.navigationService.changeUrl('levels/create');
            });
    }

    back() {
        this.navigationService.back();
    }

    getDisplayNameErrorMessage() {
        return this.createForm.controls.displayName.hasError('required') ? 'Please enter display name' :
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
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getLevelsUrl(), this.createForm.value, this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('levels');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
