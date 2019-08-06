import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css']
})
export class ParentsComponent implements OnInit {

    private httpOptions: any;
    private parnetsList: any;
    private studentsList: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = [
        'firstName',
        'lastName',
        'nickName',
        'chineseName',
        'studentsCount',
        'gender',
        'age',
        'mobile',
        'email',
        'create_date',
        'update_date',
        'active'
    ];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private configService: ConfigService
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
                                this.toastr.error(error2.error.message, 'Error', {
                                    positionClass: 'toast-top-center'
                                });
                            });
                    }
                }
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.parnetsList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }, error => {
                this.toastr.error(error.error.message, 'Error', {
                    positionClass: 'toast-top-center'
                });
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.router.navigateByUrl('/parents/create');
    }

    view(row) {
        this.router.navigateByUrl('/parents/' + row.id);
    }
}

export interface PeriodicElement {
    firstName: string;
    lastName: string;
    nickName: string;
    chineseName: string;
    studentsCount: number;
    gender: string;
    age: string;
    mobile: string;
    email: string;
    create_date: string;
    update_date: string;
    active: boolean;
}
