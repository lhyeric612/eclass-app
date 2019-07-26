import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private cookieService: CookieService
    ) { }

    ngOnInit() {
        if (this.cookieService.check('eclass-app')) {
            console.log('token exist');
        }
    }

}
