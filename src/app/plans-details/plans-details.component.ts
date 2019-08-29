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
    selector: 'app-plans-details',
    templateUrl: './plans-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./plans-details.component.css']
})
export class PlansDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private planData: any;
    private planId: string;
    private now: any;
    private userMeData: any;
    private userId: string;
    private courses: any;

    editForm = new FormGroup({
        coursesId: new FormControl('', [Validators.required]),
        planName: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        qty: new FormControl(1, [Validators.required]),
        unit: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deletePlanId: new FormControl('', [Validators.required])
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
            this.planId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                    this.http.get(this.configService.getPlansByIdUrl(this.planId), this.httpOptions)
                    .subscribe(response => {
                        this.planData = response;
                        this.editForm.controls.coursesId.setValue(this.planData.coursesId);
                        this.editForm.controls.planName.setValue(this.planData.planName);
                        this.editForm.controls.description.setValue(this.planData.description);
                        this.editForm.controls.qty.setValue(this.planData.qty);
                        if (this.planData.byLesson && !this.planData.byMonth) {
                            this.editForm.controls.unit.setValue('lesson');
                        } else {
                            this.editForm.controls.unit.setValue('month');
                        }
                        this.editForm.controls.price.setValue(this.planData.price);
                        this.editForm.controls.active.setValue(this.planData.active);
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('plans/' + this.planId);
                    });
                this.http.get(this.configService.getCoursesUrl(), this.httpOptions)
                    .subscribe(courseResponse => {
                        this.courses = courseResponse;
                    }, error => {
                        this.navigationService.changeUrl('plans/' + this.planId);
                    });
                }, error => {
                    this.navigationService.changeUrl('plans/' + this.planId);
                });
        });
    }

    back() {
        this.navigationService.back();
    }

    getCourseErrorMessage() {
        return this.editForm.controls.coursesId.hasError('required') ? 'Please select courses' :
            '';
    }

    getPlanNameErrorMessage() {
        return this.editForm.controls.planName.hasError('required') ? 'Please enter plan name' :
            '';
    }

    getQtyErrorMessage() {
        return this.editForm.controls.qty.hasError('required') ? 'Please enter quality' :
            '';
    }

    getUnitErrorMessage() {
        return this.editForm.controls.unit.hasError('required') ? 'Please select unit' :
                '';
    }

    getPriceErrorMessage() {
        return this.editForm.controls.price.hasError('required') ? 'Please enter price' :
                '';
    }

    getPlanIdErrorMessage() {
        return this.deleteForm.controls.deletePlanId.hasError('required') ? 'Please enter plan id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            if (this.editForm.value.unit == 'lesson') {
                this.editForm.value.byLesson = true;
            } else {
                this.editForm.value.byLesson = false;
            }
            if (this.editForm.value.unit == 'month') {
                this.editForm.value.byMonth = true;
            } else {
                this.editForm.value.byMonth = false;
            }
            const data = {
                coursesId: this.editForm.value.coursesId,
                planName: this.editForm.value.planName,
                description: this.editForm.value.description,
                qty: this.editForm.value.qty,
                price: this.editForm.value.price,
                byLesson: this.editForm.value.byLesson,
                byMonth: this.editForm.value.byMonth,
                updateDate: this.now,
                updateBy: this.userId,
                active: true,
            }
            this.http.patch(this.configService.getPlansByIdUrl(this.planId), data, this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('plans');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deletePlanId.value === this.planId) {
            this.http.delete(this.configService.getPlansByIdUrl(this.planId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('plans');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Plan id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
