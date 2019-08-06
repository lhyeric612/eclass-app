import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfigService} from '../config.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-subjects-details',
    templateUrl: './subjects-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./subjects-details.component.css']
})
export class SubjectsDetailsComponent implements OnInit {

    private routeSub: Subscription;
    private httpOptions: any;
    private subjectData: any;
    private subjectId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        display_name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteSubjectId: new FormControl('', [Validators.required])
    });

    constructor(
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService,
        private datePipe: DatePipe
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
            this.subjectId = params.id;
            this.http.get(this.configService.getSubjectByIdUrl(this.subjectId), this.httpOptions)
                .subscribe(userByIdResponse => {
                    this.subjectData = userByIdResponse;
                    this.editForm.controls.display_name.setValue(this.subjectData.display_name);
                    this.editForm.controls.code.setValue(this.subjectData.code);
                    this.editForm.controls.active.setValue(this.subjectData.active);
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        });
    }

    back() {
        this.router.navigateByUrl('/subjects');
    }

    getDisplayNameErrorMessage() {
        return this.editForm.controls.display_name.hasError('required') ? 'Please enter display name' :
                '';
    }

    getCodeErrorMessage() {
        return this.editForm.controls.code.hasError('required') ? 'Please enter code' :
            '';
    }

    getSubjectIdErrorMessage() {
        return this.deleteForm.controls.deleteSubjectId.hasError('required') ? 'Please enter subject id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.update_date = this.now;
            this.editForm.value.update_by = this.userId;
            this.http.patch(this.configService.getSubjectByIdUrl(this.subjectId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.router.navigateByUrl('/subjects');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteSubjectId.value === this.subjectId) {
            this.http.delete(this.configService.getSubjectByIdUrl(this.subjectId), this.httpOptions)
                .subscribe(response => {
                    this.router.navigateByUrl('/subjects');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Subject id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
