import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-students-details',
    templateUrl: './students-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./students-details.component.css']
})
export class StudentsDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private studentData: any;
    private studentId: string;
    private now: any;
    private userMeData: any;
    private userId: string;
    private parents: any;

    editForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        nickName: new FormControl(''),
        chineseName: new FormControl(''),
        gender: new FormControl(''),
        birthday: new FormControl(''),
        parentId: new FormControl(''),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteStudentId: new FormControl('', [Validators.required])
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
            this.studentId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                    this.http.get(this.configService.getParentsUrl(), this.httpOptions)
                        .subscribe(response => {
                            this.parents = response;
                            if (this.parents.length > 0) {
                                for (const parent of this.parents) {
                                    parent.name = parent.firstName + ' ' + parent.lastName;
                                }
                            }
                            this.http.get(this.configService.getStudentByIdUrl(this.studentId), this.httpOptions)
                            .subscribe(userByIdResponse => {
                                this.studentData = userByIdResponse;
                                this.editForm.controls.firstName.setValue(this.studentData.firstName);
                                this.editForm.controls.lastName.setValue(this.studentData.lastName);
                                this.editForm.controls.nickName.setValue(this.studentData.nickName);
                                this.editForm.controls.chineseName.setValue(this.studentData.chineseName);
                                this.editForm.controls.gender.setValue(this.studentData.gender);
                                this.editForm.controls.birthday.setValue(new Date(this.studentData.birthday));
                                this.editForm.controls.parentId.setValue(this.studentData.parentId);
                                this.editForm.controls.active.setValue(this.studentData.active);
                                this.progressMode = 'determinate';
                                this.progressValue = 100;
                            }, error => {
                                this.navigationService.changeUrl('students-details');
                            });
                        }, error => {
                            this.navigationService.changeUrl('students-details');
                        });
                }, error => {
                    this.navigationService.changeUrl('students-details');
                });
        });
    }

    back() {
        this.navigationService.back();
    }

    getFirstNameErrorMessage() {
        return this.editForm.controls.firstName.hasError('required') ? 'Please enter first name' :
            '';
    }

    getLastNameErrorMessage() {
        return this.editForm.controls.lastName.hasError('required') ? 'Please enter last name' :
            '';
    }

    getMobileErrorMessage() {
        return this.editForm.controls.mobile.hasError('required') ? 'Please enter mobile' :
            '';
    }

    getParentErrorMessage() {
        return this.editForm.controls.parentId.hasError('required') ? 'Please select parent' :
                '';
    }

    getStudentIdErrorMessage() {
        return this.deleteForm.controls.deleteStudentId.hasError('required') ? 'Please enter student id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.birthday = this.datePipe.transform(this.editForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getStudentByIdUrl(this.studentId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('students');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteStudentId.value === this.studentId) {
            this.http.delete(this.configService.getStudentByIdUrl(this.studentId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('students');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Student id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
