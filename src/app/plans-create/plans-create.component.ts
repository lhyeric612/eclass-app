import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-plans-create',
    templateUrl: './plans-create.component.html',
    providers: [DatePipe],
    styleUrls: ['./plans-create.component.css']
})
export class PlansCreateComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private userMeData: any;
    private userId: string;
    private courses: any;
    private now: any;

    createForm = new FormGroup({
        coursesId: new FormControl('', [Validators.required]),
        planName: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        qty: new FormControl(1, [Validators.required]),
        unit: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required])
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
                this.http.get(this.configService.getCoursesUrl(), this.httpOptions)
                    .subscribe(courseResponse => {
                        this.courses = courseResponse;
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('plans/create');
                    });
            }, error => {
                this.navigationService.changeUrl('plans/create');
            });
    }

    back() {
        this.navigationService.back();
    }

    getCourseErrorMessage() {
        return this.createForm.controls.coursesId.hasError('required') ? 'Please select courses' :
            '';
    }

    getPlanNameErrorMessage() {
        return this.createForm.controls.planName.hasError('required') ? 'Please enter plan name' :
            '';
    }

    getQtyErrorMessage() {
        return this.createForm.controls.qty.hasError('required') ? 'Please enter quality' :
            '';
    }

    getUnitErrorMessage() {
        return this.createForm.controls.unit.hasError('required') ? 'Please select unit' :
                '';
    }

    getPriceErrorMessage() {
        return this.createForm.controls.price.hasError('required') ? 'Please enter price' :
                '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.createForm.valid) {
            if (this.createForm.value.unit == 'lesson') {
                this.createForm.value.byLesson = true;
            } else {
                this.createForm.value.byLesson = false;
            }
            if (this.createForm.value.unit == 'month') {
                this.createForm.value.byMonth = true;
            } else {
                this.createForm.value.byMonth = false;
            }
            const data = {
                coursesId: this.createForm.value.coursesId,
                planName: this.createForm.value.planName,
                description: this.createForm.value.description,
                qty: this.createForm.value.qty,
                price: this.createForm.value.price,
                byLesson: this.createForm.value.byLesson,
                byMonth: this.createForm.value.byMonth,
                createDate: this.now,
                createBy: this.userId,
                active: true,
            }
            this.http.post(this.configService.getPlansUrl(), data, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('plans');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

}
