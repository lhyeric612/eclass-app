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
    selector: 'app-subjects-details',
    templateUrl: './subjects-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./subjects-details.component.css']
})
export class SubjectsDetailsComponent implements OnInit {
    
    progressMode = 'indeterminate';
    progressValue = 0;

    private routeSub: Subscription;
    private httpOptions: any;
    private subjectData: any;
    private subjectId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        displayName: new FormControl('', [Validators.required]),
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
            this.subjectId = params.id;
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.userId = this.userMeData.id;
                    this.http.get(this.configService.getSubjectByIdUrl(this.subjectId), this.httpOptions)
                        .subscribe(userByIdResponse => {
                            this.subjectData = userByIdResponse;
                            this.editForm.controls.displayName.setValue(this.subjectData.displayName);
                            this.editForm.controls.code.setValue(this.subjectData.code);
                            this.editForm.controls.active.setValue(this.subjectData.active);
                            this.progressMode = 'determinate';
                            this.progressValue = 100;
                        }, error => {
                            this.navigationService.changeUrl('subjects/' + this.subjectId);
                        });
                }, error => {
                    this.navigationService.changeUrl('subjects/' + this.subjectId);
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

    getSubjectIdErrorMessage() {
        return this.deleteForm.controls.deleteSubjectId.hasError('required') ? 'Please enter subject id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.updateDate = this.now;
            this.editForm.value.updateBy = this.userId;
            this.http.patch(this.configService.getSubjectByIdUrl(this.subjectId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('subjects');
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
                    this.navigationService.changeUrl('subjects');
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
