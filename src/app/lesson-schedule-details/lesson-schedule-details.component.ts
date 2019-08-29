import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';
import { DOCUMENT } from '@angular/common';

@Component({
  	selector: 'app-lesson-schedule-details',
	templateUrl: './lesson-schedule-details.component.html',
	providers: [DatePipe],
  	styleUrls: ['./lesson-schedule-details.component.css']
})
export class LessonScheduleDetailsComponent implements OnInit {

	previewMode = true;
	progressMode = 'indeterminate';
    progressValue = 0;

    isLoading = false;
    generateMode = 'indeterminate';
    generateValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private httpHeader: any;
    private lessonScheduleData: any;
    private lessonScheduleId: string;
    private now: any;
    private userMeData: any;
    private userId: string;
    private classes: any;
    private courses: any;
    private teachers: any;
    private tempGenerateDates: Array<String> = [];
    private generateDates: Array<String> = [];
    private hkgovCalJson: any;
    private nowPublicHolidayList: Array<String> = [];
    private generateCountTotal: number = 0;
    private generateCount: number = 0;
    private scheduleStatus: string;

    editForm = new FormGroup({
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
        publicHolidays: new FormControl(false)
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
        { id: 0, displayName: "Sunday" }
    ];

    constructor(
        @Inject(DOCUMENT) private document: Document,
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
            this.lessonScheduleId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
            .subscribe(userMenResponse => {
                this.userMeData = userMenResponse;
                this.userId = this.userMeData.id;
                this.http.get(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.httpOptions)
                    .subscribe(response => {
                        this.lessonScheduleData = response;
                        this.editForm.controls.classesId.setValue(this.lessonScheduleData.classesId);
                        this.editForm.controls.coursesId.setValue(this.lessonScheduleData.coursesId);
                        this.editForm.controls.teachers.setValue(this.lessonScheduleData.teachers);
						this.editForm.controls.title.setValue(this.lessonScheduleData.title);
						this.editForm.controls.startTime.setValue(this.lessonScheduleData.startTime);
						this.editForm.controls.endTime.setValue(this.lessonScheduleData.endTime);
						this.editForm.controls.studentNum.setValue(this.lessonScheduleData.studentNum);
						this.editForm.controls.fromDate.setValue(this.lessonScheduleData.fromDate);
						this.editForm.controls.toDate.setValue(this.lessonScheduleData.toDate);
						this.editForm.controls.totalLessons.setValue(this.lessonScheduleData.totalLessons);
                        this.editForm.controls.weeks.setValue(this.lessonScheduleData.weeks);
                        this.editForm.controls.publicHolidays.setValue(this.lessonScheduleData.publicHolidays);
                        this.scheduleStatus = this.lessonScheduleData.status;
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/' + this.lessonScheduleId);
                    });
				this.http.get(this.configService.getClassesUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.classes = response;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/' + this.lessonScheduleId);
                    });
                this.http.get(this.configService.getCoursesUrl(), this.httpOptions)
                    .subscribe(response => {
                        this.courses = response;
                    }, error => {
                        this.navigationService.changeUrl('lesson-schedule/' + this.lessonScheduleId);
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
                        this.navigationService.changeUrl('lesson-schedule/' + this.lessonScheduleId);
                    });
            }, error => {
                this.navigationService.changeUrl('lesson-schedule/' + this.lessonScheduleId);
            });
        });
    }

    back() {
        this.navigationService.back();
    }
    

    getClassErrorMessage() {
        return this.editForm.controls.classesId.hasError('required') ? 'Please select class' :
            '';
    }

    getCourseErrorMessage() {
        return this.editForm.controls.coursesId.hasError('required') ? 'Please select course' :
            '';
    }

    getTeachersErrorMessage() {
        return this.editForm.controls.teachers.hasError('required') ? 'Please select teacher' :
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

    getWeeksErrorMessage() {
        return this.editForm.controls.weeks.hasError('required') ? 'Please select weeks' :
            '';
    }

    getLessonScheduleIdErrorMessage() {
        return this.deleteForm.controls.deleteLessonScheduleId.hasError('required') ? 'Please enter lesson schedule id' :
            '';
	}
	
	onEdit() {
		this.previewMode = false;
	}

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.fromDate = this.datePipe.transform(this.editForm.value.fromDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
            this.editForm.value.toDate = this.datePipe.transform(this.editForm.value.toDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('lesson-schedule');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onGenerate() {
        this.isLoading = true;
        this.document.body.classList.add('overflow-hidden');
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.fromDate = this.datePipe.transform(this.editForm.value.fromDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
            if (this.editForm.value.toDate != "") {
                this.editForm.value.toDate = this.datePipe.transform(this.editForm.value.toDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');   
            }
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.editForm.value, this.httpOptions)
                .subscribe(response => {
                    console.log(this.editForm.value);
                    const fromdate = new Date(this.editForm.value.fromDate);
                    let dayscount = 0;
                    if (this.editForm.value.toDate != "") {
                        const todate = new Date(this.editForm.value.toDate);
                        dayscount = Math.abs(todate.getTime() - fromdate.getTime()) / (1000 * 60 * 60 * 24) + 1;
                    } else {
                        dayscount = this.editForm.value.totalLessons;
                    }
                    
                    let generatestartdate = fromdate;
                    
                    for (let i = 0; i < dayscount; i++) {
                        let datestring = this.datePipe.transform(generatestartdate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                        this.tempGenerateDates.push(datestring);
                        generatestartdate.setDate(generatestartdate.getDate() + 1);
                    }

                    for (let tempdate of this.tempGenerateDates) {
                        let generateweek = new Date(this.datePipe.transform(tempdate, 'yyyy-MM-ddTHH:mm:ss', '+0800')).getDay();
                        let weeks = this.editForm.value.weeks;
                        if (weeks.includes(generateweek)) {
                            this.generateDates.push(tempdate);
                        }
                    }
                    console.log(this.generateDates);
                    if (this.editForm.value.publicHolidays) {
                        this.http.get('../assets/ical/tc.json')
                            .subscribe(response => {
                                this.hkgovCalJson = response;
                                this.hkgovCalJson = this.hkgovCalJson.vcalendar[0].vevent;
                                const nowYear = this.datePipe.transform(new Date(), 'yyyy', '+0800');
                                for (const hkgovCal of this.hkgovCalJson) {
                                    if (hkgovCal.dtstart[0].includes(nowYear)) {
                                        const year = hkgovCal.dtstart[0].substring(0, 4);
                                        const month = hkgovCal.dtstart[0].substring(4, 6);
                                        const day = hkgovCal.dtstart[0].substring(6, 8);
                                        let date = this.datePipe.transform(year + '-' + month + '-' + day, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                                        this.nowPublicHolidayList.push(date);
                                    }
                                }
                                console.log(this.nowPublicHolidayList);
                                for (const generateDate of this.generateDates) {
                                    if (this.nowPublicHolidayList.includes(generateDate)) {
                                        const index = this.generateDates.indexOf(generateDate);
                                        if (index !== -1) {
                                            this.generateDates.splice(index, 1);
                                        }
                                    }
                                }
                                console.log(this.generateDates);
                                this.generateMode = 'determinate';
                                this.generateValue = 0;
                                this.generateCountTotal = this.generateDates.length;
                                for (const generateDate of this.generateDates) {
                                    this.generateCount++;
                                    this.now = new Date();
                                    this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
                                    if (this.editForm.valid) {
                                        const data = {
                                            classesId: this.editForm.value.classesId,
                                            coursesId: this.editForm.value.coursesId,
                                            teachers: this.editForm.value.teachers,
                                            session: this.generateCount,
                                            date: generateDate,
                                            startTime: this.editForm.value.startTime,
                                            endTime: this.editForm.value.endTime,
                                            studentNum: this.editForm.value.studentNum,
                                            createDate: this.now,
                                            createBy: this.userId,
                                            active: true
                                        };
                                        this.http.post(this.configService.getLessonsUrl(), data, this.httpOptions)
                                            .subscribe( response => {
                                                this.generateValue = this.generateCount / this.generateCountTotal * 100;
                                            }, error => {
                                                this.toastr.error(error.error.message, 'Error', {
                                                    positionClass: 'toast-top-center'
                                                });
                                            });
                                    }
                                }
                                this.editForm.value.status = "Generated";
                                this.editForm.value.fromDate = this.datePipe.transform(this.editForm.value.fromDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                                this.editForm.value.toDate = this.datePipe.transform(this.editForm.value.toDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                                this.editForm.value.updateDate = this.now;
                                this.editForm.value.updateBy = this.userId;
                                this.http.patch(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.editForm.value, this.httpOptions)
                                    .subscribe( response => {
                                        this.document.body.classList.remove('overflow-hidden');
                                        this.navigationService.changeUrl('lesson-schedule');
                                    }, error => {
                                        this.toastr.error(error.error.message, 'Error', {
                                            positionClass: 'toast-top-center'
                                        });
                                    });
                            });    
                    } else {
                        this.generateMode = 'determinate';
                        this.generateValue = 0;
                        this.generateCountTotal = this.generateDates.length;
                        for (const generateDate of this.generateDates) {
                            this.generateCount++;
                            this.now = new Date();
                            this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
                            if (this.editForm.valid) {
                                const data = {
                                    classesId: this.editForm.value.classesId,
                                    coursesId: this.editForm.value.coursesId,
                                    teachers: this.editForm.value.teachers,
                                    session: this.generateCount,
                                    date: generateDate,
                                    startTime: this.editForm.value.startTime,
                                    endTime: this.editForm.value.endTime,
                                    studentNum: this.editForm.value.studentNum,
                                    createDate: this.now,
                                    createBy: this.userId,
                                    active: true
                                };
                                this.http.post(this.configService.getLessonsUrl(), data, this.httpOptions)
                                    .subscribe( response => {
                                        this.generateValue = this.generateCount / this.generateCountTotal * 100;
                                    }, error => {
                                        this.toastr.error(error.error.message, 'Error', {
                                            positionClass: 'toast-top-center'
                                        });
                                    });
                            }
                        }
                        this.editForm.value.status = "Generated";
                        this.editForm.value.fromDate = this.datePipe.transform(this.editForm.value.fromDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                        this.editForm.value.toDate = this.datePipe.transform(this.editForm.value.toDate, 'yyyy-MM-ddTHH:mm:ss', '+0800');
                        this.editForm.value.updateDate = this.now;
                        this.editForm.value.updateBy = this.userId;
                        this.http.patch(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.editForm.value, this.httpOptions)
                            .subscribe( response => {
                                this.document.body.classList.remove('overflow-hidden');
                                this.navigationService.changeUrl('lesson-schedule');
                            }, error => {
                                this.toastr.error(error.error.message, 'Error', {
                                    positionClass: 'toast-top-center'
                                });
                            });
                    }
                    
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteLessonScheduleId.value === this.lessonScheduleId) {
            this.http.delete(this.configService.getLessonScheduleByIdUrl(this.lessonScheduleId), this.httpOptions)
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
