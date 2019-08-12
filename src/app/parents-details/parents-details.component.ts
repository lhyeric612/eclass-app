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
    selector: 'app-parents-details',
    templateUrl: './parents-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./parents-details.component.css']
})
export class ParentsDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private parentData: any;
    private parentId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        nickName: new FormControl(''),
        chineseName: new FormControl(''),
        gender: new FormControl(''),
        birthday: new FormControl(''),
        address: new FormControl(''),
        mobile: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteParentId: new FormControl('', [Validators.required])
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
            this.parentId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                    this.http.get(this.configService.getParentByIdUrl(this.parentId), this.httpOptions)
                    .subscribe(userByIdResponse => {
                        this.parentData = userByIdResponse;
                        this.editForm.controls.firstName.setValue(this.parentData.firstName);
                        this.editForm.controls.lastName.setValue(this.parentData.lastName);
                        this.editForm.controls.nickName.setValue(this.parentData.nickName);
                        this.editForm.controls.chineseName.setValue(this.parentData.chineseName);
                        this.editForm.controls.gender.setValue(this.parentData.gender);
                        if (this.parentData.birthday != "") {
                            this.editForm.controls.birthday.setValue(new Date(this.parentData.birthday));    
                        }
                        this.editForm.controls.address.setValue(this.parentData.address);
                        this.editForm.controls.mobile.setValue(this.parentData.mobile);
                        this.editForm.controls.email.setValue(this.parentData.email);
                        this.editForm.controls.active.setValue(this.parentData.active);
                        this.progressMode = 'determinate';
                        this.progressValue = 100;
                    }, error => {
                        this.navigationService.changeUrl('parents/' + this.parentId);
                    });
                }, error => {
                    this.navigationService.changeUrl('parents/' + this.parentId);
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

    getEmailErrorMessage() {
        return this.editForm.controls.email.hasError('required') ? 'Please enter email' :
            this.editForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getParentIdErrorMessage() {
        return this.deleteForm.controls.deleteParentId.hasError('required') ? 'Please enter parent id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            if (this.editForm.value.birthday != "") {
                this.editForm.value.birthday = this.datePipe.transform(this.editForm.value.birthday, 'yyyy-MM-dd HH:mm:ss', '+0800');    
            }
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getParentByIdUrl(this.parentId), this.editForm.value, this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('parents');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteParentId.value === this.parentId) {
            this.http.delete(this.configService.getParentByIdUrl(this.parentId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('parents');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Parent id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
