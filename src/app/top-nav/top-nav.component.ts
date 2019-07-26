import {Component, Inject, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { ConfigService } from '../config.service';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

    private httpOptions: any;
    private displayName: string;
    private userMeData: any;

    searchForm = this.formBuilder.group({
        keyword: ['']
    });

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private cookieService: CookieService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private router: Router,
        private configService: ConfigService
    ) {
        if (this.cookieService.check('eclass-app')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        }
    }

    ngOnInit() {
        if(this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.userMeData = userMenResponse;
                    this.displayName = this.userMeData.name;
                }, error => {
                    if (error.status === 401) {
                        this.cookieService.delete('eclass-app');
                        this.router.navigateByUrl('/');
                    }
                });
        }
    }

    onKeywordChange(keyword) {
        console.log(keyword);
    }

    onMenuIconAction() {
        if (!this.document.body.classList.contains('mini-navbar')) {
            this.document.body.classList.add('mini-navbar');
        } else {
            this.document.body.classList.remove('mini-navbar');
        }
    }

}
