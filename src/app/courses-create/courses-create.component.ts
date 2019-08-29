import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-courses-create',
    templateUrl: './courses-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./courses-create.component.css']
})
export class CoursesCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;
    private subjects: any;
    private levels: any;

    createForm = new FormGroup({
        subjectsId: new FormControl('', [Validators.required]),
        levelsId: new FormControl('', [Validators.required]),
        courseName: new FormControl('', [Validators.required])
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
                this.http.get(this.configService.getLevelsUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.levels = response;
                    }, error => {
                        this.navigationService.changeUrl('courses/create');
                    });
                this.http.get(this.configService.getSubjectsUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.subjects = response;
                    }, error => {
                        this.navigationService.changeUrl('courses/create');
                    });
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('courses/create');
            });
    }

    back() {
        this.navigationService.back();
    }

    getSubjectErrorMessage() {
        return this.createForm.controls.subjectsId.hasError('required') ? 'Please select subject' :
            '';
    }

    getLevelErrorMessage() {
        return this.createForm.controls.levelsId.hasError('required') ? 'Please select level' :
            '';
    }

    getCourseNameErrorMessage() {
        return this.createForm.controls.courseName.hasError('required') ? 'Please enter course name' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.active = true;
            this.http.post(this.configService.getCoursesUrl(), this.createForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('courses');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
