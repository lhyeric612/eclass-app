import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-teachers',
    templateUrl: './teachers.component.html',
    styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private teacherList: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'age', 'mobile', 'email', 'createDate', 'updateDate', 'active'];

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

        this.http.get(this.configService.getTeachersUrl(), this.httpOptions)
            .subscribe(response => {
                this.teacherList = response;
                if (this.teacherList.length > 0) {
                    for (const teacherData of this.teacherList) {
                        teacherData.age = new Date().getFullYear() - new Date(teacherData.birthday).getFullYear();
                    }
                }
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.teacherList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.router.navigateByUrl('/');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('/teachers/create');
    }

    view(row) {
        this.navigationService.changeUrl('/teachers/' + row.id);
    }
}

export interface PeriodicElement {
    firstName: string;
    lastName: string;
    gender: string;
    age: string;
    mobile: string;
    email: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
