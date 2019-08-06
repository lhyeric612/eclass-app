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
    selector: 'app-levels-details',
    templateUrl: './levels-details.component.html',
    providers: [DatePipe],
    styleUrls: ['./levels-details.component.css']
})
export class LevelsDetailsComponent implements OnInit {

    private routeSub: Subscription;
    private httpOptions: any;
    private levelData: any;
    private levelId: string;
    private now: any;
    private userMeData: any;
    private userId: string;

    editForm = new FormGroup({
        display_name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        active: new FormControl('')
    });

    deleteForm = new FormGroup({
        deleteLevelId: new FormControl('', [Validators.required])
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
                    this.router.navigateByUrl('/');
                });
        }
        this.routeSub = this.route.params.subscribe(params => {
            this.levelId = params.id;
            this.http.get(this.configService.getLevelByIdUrl(this.levelId), this.httpOptions)
                .subscribe(userByIdResponse => {
                    this.levelData = userByIdResponse;
                    this.editForm.controls.display_name.setValue(this.levelData.display_name);
                    this.editForm.controls.code.setValue(this.levelData.code);
                    this.editForm.controls.active.setValue(this.levelData.active);
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
        return this.editForm.controls.display_name.hasError('required') ? 'Please enter display name' :
            '';
    }

    getCodeErrorMessage() {
        return this.editForm.controls.code.hasError('required') ? 'Please enter code' :
            '';
    }

    getLevelIdErrorMessage() {
        return this.deleteForm.controls.deleteLevelId.hasError('required') ? 'Please enter level id' :
            '';
    }

    onSubmit() {
        this.now = new Date();
        this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd HH:mm:ss', '+0800');
        if (this.editForm.valid) {
            this.editForm.value.update_date = this.now;
            this.editForm.value.update_by = this.userId;
            this.http.patch(this.configService.getLevelByIdUrl(this.levelId), this.editForm.value, this.httpOptions)
                .subscribe( response => {
                    this.navigationService.changeUrl('/levels');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        }
    }

    onDelete() {
        if (this.deleteForm.valid && this.deleteForm.controls.deleteLevelId.value === this.levelId) {
            this.http.delete(this.configService.getLevelByIdUrl(this.levelId), this.httpOptions)
                .subscribe(response => {
                    this.navigationService.changeUrl('/levels');
                }, error => {
                    this.toastr.error(error.error.message, 'Error', {
                        positionClass: 'toast-top-center'
                    });
                });
        } else {
            this.toastr.error('Level id is wrong.', 'Error', {
                positionClass: 'toast-top-center'
            });
        }
    }

}
