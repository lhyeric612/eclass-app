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
    private teachers: any;
    private createResponse: any;

    createForm = new FormGroup({
        classesId: new FormControl('', [Validators.required]),
        coursesId: new FormControl('', [Validators.required]),
        teachers: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        studentNum: new FormControl(0, [Validators.required]),
        fromDate: new FormControl('', [Validators.required]),
        toDate: new FormControl(''),
        totalLessons: new FormControl(0),
        weeks: new FormControl('', [Validators.required]),
        publicHolidays: new FormControl(false, [Validators.required])
    });

    weeks = [
        { id: 1, displayName: "Monday" },
        { id: 2, displayName: "Tuesday" },
        { id: 3, displayName: "Wednesday" },
        { id: 4, displayName: "Thursday" },
        { id: 5, displayName: "Friday" },
        { id: 6, displayName: "Saturday" },
        { id: 0, displayName: "Sunday" }
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
                this.http.get(this.configService.getTeachersUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.teachers = response;
                        if (this.teachers.length > 0) {
                            for (let teacher of this.teachers) {
                                teacher.displayName = teacher.firstName + ' ' + teacher.lastName;
                            }
                        }
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
        return this.createForm.controls.classesId.hasError('required') ? 'Please select class' :
            '';
    }

    getCourseErrorMessage() {
        return this.createForm.controls.coursesId.hasError('required') ? 'Please select course' :
            '';
    }

    getTeachersErrorMessage() {
        return this.createForm.controls.teachers.hasError('required') ? 'Please select teacher' :
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

    getWeeksErrorMessage() {
        return this.createForm.controls.weeks.hasError('required') ? 'Please select weeks' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            this.createForm.value.fromDate = this.datePipe.transform(this.createForm.value.fromDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
            if (this.createForm.value.toDate != "") {
                this.createForm.value.toDate = this.datePipe.transform(this.createForm.value.toDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');    
            }
            this.createForm.value.createDate = this.now;
            this.createForm.value.createBy = this.userId;
            this.createForm.value.status = 'Pending';
            this.http.post(this.configService.getLessonScheduleUrl(), this.createForm.value, this.httpOptions)
                .subscribe(response => {
                    this.toastr.success('Lesson Schedule Job Created.', 'Success', {
                        positionClass: 'toast-top-center'
                    });
                    this.createResponse = response;
                    this.navigationService.changeUrl('lesson-schedule/' + this.createResponse.id);
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
