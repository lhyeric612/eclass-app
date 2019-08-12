import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-classes-details',
    templateUrl: './classes-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./classes-details.component.css']
})
export class ClassesDetailsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private classesData: any;
    private classesId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        displayName: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteClassesId: new FormControl('', [Validators.required])
    });

    constructor(
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
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
        if (this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                }, error => {
                    // if (error.status === 401) {
                    //     this.cookieService.delete('eclass-app');
                    //     this.router.navigateByUrl('/');
                    // }
                });
        }
        this.routeSub = this.route.params.subscribe(params => {
            this.classesId = params.id;
            this.http.get(this.configService.getClassesByIdUrl(this.classesId), this.httpOptions)
                .subscribe(userByIdResponse => {
                    this.classesData = userByIdResponse;
                    this.editForm.controls.displayName.setValue(this.classesData.displayName);
                    this.editForm.controls.code.setValue(this.classesData.code);
                    this.editForm.controls.active.setValue(this.classesData.active);
                    this.progressMode = 'determinate';
                    this.progressValue = 100;
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        });
    }

    back() {
        this.navigationService.back();
    }

    getDisplayNameErrorMessage() {
        return this.editForm.controls.displayName.hasError('required') ? 'Please enter display name' :
            '';
    }

    getCodeErrorMessage() {
        return this.editForm.controls.code.hasError('required') ? 'Please enter code' :
            '';
    }

    getClassesIdErrorMessage() {
        return this.deleteForm.controls.deleteClassesId.hasError('required') ? 'Please enter classes id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getClassesByIdUrl(this.classesId), this.editForm.value, this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('/classes');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteClassesId.value === this.classesId) {
            this.http.delete(this.configService.getClassesByIdUrl(this.classesId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('/classes');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Classes id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
