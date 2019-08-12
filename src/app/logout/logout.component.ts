import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

    constructor(
        private router: Router,
        private cookieService: CookieService
    ) { }

    ngOnInit() {
        this.cookieService.delete('eclass-app');
        this.cookieService.delete('a');
        this.cookieService.delete('b');
        this.router.navigateByUrl('/');
    }

}
