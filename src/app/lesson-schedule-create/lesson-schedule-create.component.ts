import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-lesson-schedule-create',
  templateUrl: './lesson-schedule-create.component.html',
  providers: [DatePipe],
  styleUrls: ['./lesson-schedule-create.component.css']
})
export class LessonScheduleCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private now: any;
    private classes: any;
    private courses: any;
    private createResponse: any;

    createForm = new FormGroup({
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
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('lesson-schedule/create');
            });
    }

    back() {
        this.navigationService.back();
    }

    getClassErrorMessage() {
        return this.createForm.controls.classId.hasError('required') ? 'Please select class' :
            '';
    }

    getCourseErrorMessage() {
        return this.createForm.controls.courseId.hasError('required') ? 'Please select course' :
            '';
    }

    getTitleErrorMessage() {
        return this.createForm.controls.title.hasError('required') ? 'Please enter title' :
            '';
    }

    getStartTimeErrorMessage() {
        return this.createForm.controls.startTime.hasError('required') ? 'Please select start time' :
            '';
    }

    getEndTimeErrorMessage() {
        return this.createForm.controls.endTime.hasError('required') ? 'Please select end time' :
            '';
    }

    getStudentNumErrorMessage() {
        return this.createForm.controls.studentNum.hasError('required') ? 'Please enter number of students' :
            '';
    }

    getFromDateErrorMessage() {
        return this.createForm.controls.fromDate.hasError('required') ? 'Please select from date' :
            '';
    }

    getToDateErrorMessage() {
        return this.createForm.controls.toDate.hasError('required') ? 'Please select to date' :
            '';
    }

    getTotalLessonsErrorMessage() {
        return this.createForm.controls.totalLessons.hasError('required') ? 'Please enter number of total lessons' :
            '';
    }

    getWeeksErrorMessage() {
        return this.createForm.controls.weeks.hasError('required') ? 'Please select weeks' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.status = 'pending';
            this.http.post(this.configService.getLessonScheduleUrl(), this.createForm.value, this.httpOptions)
                .subscribe(response => {
                    this.createResponse = response;
                    // this.navigationService.changeUrl('lesson-schedule');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
