import {Component, OnInit, ViewChild} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material';
// import { library } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    private httpOptions: any;
    private userList: any;
    private noRecord: boolean;
    private countUserList: any;
    private dataSource: any;
    private userRoleData: any;

    displayedColumns: string[] = ['email', 'firstName', 'lastName', 'roleName'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router,
        private configService: ConfigService
    ) {
        if (this.cookieService.check('eclass-app')) {
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + this.cookieService.get('eclass-app')
                })
            };
        }
    }

    ngOnInit() {
        this.noRecord = true;

        if (!this.cookieService.check('eclass-app')) {
            this.router.navigateByUrl('/');
        }

        this.http.get(this.configService.getUserUrl(), this.httpOptions)
            .subscribe(userListResponse => {
                this.userList = userListResponse;
                this.countUserList = this.userList.length;
                if (this.userList.length > 0) {
                    this.noRecord = false;
                    for (const userData of this.userList) {
                        this.http.get(this.configService.getUserRoleUrl(userData.id), this.httpOptions)
                            .subscribe( userRoleResponse => {
                                this.userRoleData = userRoleResponse;
                                userData.roleName = this.userRoleData.name;
                                this.dataSource = new MatTableDataSource<PeriodicElement>(this.userList);
                                this.dataSource.sort = this.sort;
                                this.dataSource.paginator = this.paginator;
                            }, error => {
                                console.log(error);
                            });
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.router.navigateByUrl('/users/create');
    }

    view(row) {
        this.router.navigateByUrl('/users/' + row.id);
    }
}

export interface PeriodicElement {
    email: string;
    firstName: string;
    lastName: string;
    roleName: string;
}
