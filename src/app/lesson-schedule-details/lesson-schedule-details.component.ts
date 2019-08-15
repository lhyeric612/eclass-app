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
  	selector: 'app-lesson-schedule-details',
	templateUrl: './lesson-schedule-details.component.html',
	providers: [DatePipe],
  	styleUrls: ['./lesson-schedule-details.component.css']
})
export class LessonScheduleDetailsComponent implements OnInit {

	progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private lessonScheduleData: any;
    private lessonSchedlueId: string;
    private now: any;
    private userMeData: any;
    private userId: string;
    private classes: any;
    private courses: any;

    editForm = new FormGroup({
        classId: new FormControl('', [Validators.required]),
        courseId: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        studentNum: new FormControl(0, [Validators.required]),
        fromDate: new FormControl('', [Validators.required]),
        toDate: new FormControl(''),
        totalLessons: new FormControl(0),
        weeks: new FormControl('', [Validators.required])
    });

    deleteForm = new FormGroup({
        deleteLessonScheduleId: new FormControl('', [Validators.required])
	});
	
	weeks = [
        { id: 1, displayName: "Monday" },
        { id: 2, displayName: "Tuesday" },
        { id: 3, displayName: "Wednesday" },
        { id: 4, displayName: "Thursday" },
        { id: 5, displayName: "Friday" },
        { id: 6, displayName: "Saturday" },
        { id: 7, displayName: "Sunday" }
    ];

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
            this.lessonSchedlueId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMenResponse => {
                this.userMeData = userMenResponse;
                this.userId = this.userMeData.id;
                this.http.get(this.configService.getLessonScheduleByIdUrl(this.lessonSchedlueId), this.httpOptions)
                    .subscribe(response => {
                        this.lessonScheduleData = response;
                        this.editForm.controls.classId.setValue(this.lessonScheduleData.classId);
                        this.editForm.controls.courseId.setValue(this.lessonScheduleData.courseId);
						this.editForm.controls.title.setValue(this.lessonScheduleData.title);
						this.editForm.controls.startTime.setValue(this.lessonScheduleData.startTime);
						this.editForm.controls.endTime.setValue(this.lessonScheduleData.endTime);
						this.editForm.controls.studentNum.setValue(this.lessonScheduleData.studentNum);
						this.editForm.controls.fromDate.setValue(this.lessonScheduleData.fromDate);
						this.editForm.controls.toDate.setValue(this.lessonScheduleData.toDate);
						this.editForm.controls.totalLessons.setValue(this.lessonScheduleData.totalLessons);
						this.editForm.controls.weeks.setValue(this.lessonScheduleData.weeks);
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/' + this.lessonSchedlueId);
                    });
				this.http.get(this.configService.getClassesUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.classes = response;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/create');
                    });
                this.http.get(this.configService.getCoursesUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.courses = response;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/create');
                    });
            }, error => {
                this.navigationService.changeUrl('lesson-schedule/' + this.lessonSchedlueId);
            });
        });
    }

    back() {
        this.navigationService.back();
    }
    

    getClassErrorMessage() {
        return this.editForm.controls.classId.hasError('required') ? 'Please select class' :
            '';
    }

    getCourseErrorMessage() {
        return this.editForm.controls.courseId.hasError('required') ? 'Please select course' :
            '';
    }

    getTitleErrorMessage() {
        return this.editForm.controls.title.hasError('required') ? 'Please enter title' :
            '';
    }

    getStartTimeErrorMessage() {
        return this.editForm.controls.startTime.hasError('required') ? 'Please select start time' :
            '';
    }

    getEndTimeErrorMessage() {
        return this.editForm.controls.endTime.hasError('required') ? 'Please select end time' :
            '';
    }

    getStudentNumErrorMessage() {
        return this.editForm.controls.studentNum.hasError('required') ? 'Please enter number of students' :
            '';
    }

    getFromDateErrorMessage() {
        return this.editForm.controls.fromDate.hasError('required') ? 'Please select from date' :
            '';
    }

    getToDateErrorMessage() {
        return this.editForm.controls.toDate.hasError('required') ? 'Please select to date' :
            '';
    }

    getTotalLessonsErrorMessage() {
        return this.editForm.controls.totalLessons.hasError('required') ? 'Please enter number of total lessons' :
            '';
    }

    getWeeksErrorMessage() {
        return this.editForm.controls.weeks.hasError('required') ? 'Please select weeks' :
            '';
    }

    getLessonScheduleIdErrorMessage() {
        return this.deleteForm.controls.deleteLessonScheduleId.hasError('required') ? 'Please enter lesson schedule id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getLessonScheduleByIdUrl(this.lessonSchedlueId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('lesson-schedule');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteLessonScheduleId.value === this.lessonSchedlueId) {
            this.http.delete(this.configService.getLessonScheduleByIdUrl(this.lessonSchedlueId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('lesson-schedule');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Lesson Schedule id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
