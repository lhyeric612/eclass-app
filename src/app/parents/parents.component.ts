import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css']
})
export class ParentsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private parnetsList: any;
    private studentsList: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = [
        'firstName',
        'lastName',
        // 'nickName',
        // 'chineseName',
        'studentsCount',
        'gender',
        // 'age',
        'mobile',
        'email',
        'createDate',
        'updateDate',
        'active'
    ];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
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

        this.http.get(this.configService.getParentsUrl(), this.httpOptions)
            .subscribe(response => {
                this.parnetsList = response;
                if (this.parnetsList.length > 0) {
                    for (const parentData of this.parnetsList) {
                        parentData.age = new Date().getFullYear() - new Date(parentData.birthday).getFullYear();
                        this.http.get(this.configService.getParentsStudentsUrl(parentData.id), this.httpOptions)
                            .subscribe( response2 => {
                                this.studentsList = response2;
                                parentData.studentsCount = this.studentsList.length;
                                parentData.students = this.studentsList;
                            }, error2 => {
                                this.navigationService.changeUrl('parents');
                            });
                    }
                }
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.parnetsList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('parents');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('parents/create');
    }

    view(row) {
        this.navigationService.changeUrl('parents/' + row.id);
    }
}

export interface PeriodicElement {
    firstName: string;
    lastName: string;
    // nickName: string;
    // chineseName: string;
    studentsCount: number;
    gender: string;
    // age: string;
    mobile: string;
    email: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
