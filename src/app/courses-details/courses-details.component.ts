import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-courses-details',
    templateUrl: './courses-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./courses-details.component.css']
})
export class CoursesDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private courseData: any;
    private courseId: string;
    private now: any;
    private userMeData: any;
    private userId: string;
    private subjects: any;
    private levels: any;

    editForm = new FormGroup({
        subjectId: new FormControl('', [Validators.required]),
        levelId: new FormControl('', [Validators.required]),
        courseName: new FormControl('', [Validators.required]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteCourseId: new FormControl('', [Validators.required])
    });

    constructor(
        private route: ActivatedRoute,
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
        this.routeSub = this.route.params.subscribe(params => {
            this.courseId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMenResponse => {
                this.userMeData = userMenResponse;
                this.userId = this.userMeData.id;
                this.http.get(this.configService.getCourseByIdUrl(this.courseId), this.httpOptions)
                    .subscribe(userByIdResponse => {
                        this.courseData = userByIdResponse;
                        this.editForm.controls.subjectId.setValue(this.courseData.subjectId);
                        this.editForm.controls.levelId.setValue(this.courseData.levelId);
                        this.editForm.controls.courseName.setValue(this.courseData.courseName);
                        this.editForm.controls.active.setValue(this.courseData.active);
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('courses/' + this.courseId);
                    });
                this.http.get(this.configService.getLevelsUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.levels = response;
                    }, error => {
                        this.navigationService.changeUrl('courses/' + this.courseId);
                    });
                this.http.get(this.configService.getSubjectsUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.subjects = response;
                    }, error => {
                        this.navigationService.changeUrl('courses/' + this.courseId);
                    });
            }, error => {
                this.navigationService.changeUrl('courses/' + this.courseId);
            });
        });
    }

    back() {
        this.navigationService.back();
    }
    

    getSubjectErrorMessage() {
        return this.editForm.controls.subjectId.hasError('required') ? 'Please select subject' :
            '';
    }

    getLevelErrorMessage() {
        return this.editForm.controls.levelId.hasError('required') ? 'Please select level' :
            '';
    }

    getCourseNameErrorMessage() {
        return this.editForm.controls.courseName.hasError('required') ? 'Please enter display name' :
            '';
    }

    getCourseIdErrorMessage() {
        return this.deleteForm.controls.deleteCourseId.hasError('required') ? 'Please enter course id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getCourseByIdUrl(this.courseId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('courses');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteCourseId.value === this.courseId) {
            this.http.delete(this.configService.getCourseByIdUrl(this.courseId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('courses');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Course id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
