import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private studentsList: any;
    private dataSource: any;

    displayedColumns: string[] = [
        'firstName',
        'lastName',
        // 'nickName',
        // 'chineseName',
        'gender',
        'age',
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

        this.http.get(this.configService.getStudentsUrl(), this.httpOptions)
            .subscribe(response => {
                this.studentsList = response;
                if (this.studentsList.length > 0) {
                    for (const studentData of this.studentsList) {
                      studentData.age = new Date().getFullYear() - new Date(studentData.birthday).getFullYear();
                    }
                }
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.studentsList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('students');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('students/create');
    }

    view(row) {
        this.navigationService.changeUrl('students/' + row.id);
    }
}

export interface PeriodicElement {
    firstName: string;
    lastName: string;
    // nickName: string;
    // chineseName: string;
    gender: string;
    age: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
