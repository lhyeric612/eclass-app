import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ConfigService } from '../config.service';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private router: Router,
        private configService: ConfigService
    ) {
        library.add(faBars);
        if(this.cookieService.check('eclass-app')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        }
    }

    private httpOptions: any;
    private displayName: string;

    searchForm = this.formBuilder.group({
        keyword: ['']
    });

    ngOnInit() {
        if(this.cookieService.check('eclass-app')) {
            this.http.get(this.configService.getUserMeUrl(), this.httpOptions)
                .subscribe(userMenResponse => {
                    this.displayName = userMenResponse.name;
                }, error => {
                    if(error.status === 401) {
                        this.cookieService.delete('eclass-app');
                        this.router.navigateByUrl('/');
                    }
                });
        }
    }

    onKeywordChange(keyword) {
        console.log(keyword);
    }

}
