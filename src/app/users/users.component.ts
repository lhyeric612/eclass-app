import {Component, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    private httpOptions: any;
    private userList: any;
    private noRecord: boolean;
    private dataSource: any;
    private userRoleData: any;

    displayedColumns: string[] = ['email', 'firstName', 'lastName', 'roleName', 'active'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService,
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

        this.noRecord = true;

        this.http.get(this.configService.getUserUrl(), this.httpOptions)
            .subscribe(userListResponse => {
                this.userList = userListResponse;
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
                                this.router.navigateByUrl('/');
                            });
                    }
                }
            }, error => {
                this.router.navigateByUrl('/');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('/users/create');
    }

    view(row) {
        this.navigationService.changeUrl('/users/' + row.id);
    }
}

export interface PeriodicElement {
    email: string;
    firstName: string;
    lastName: string;
    roleName: string;
    active: boolean;
}
