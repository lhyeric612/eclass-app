import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private plansList: any;
    private courseData: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = [
        'courseName',
        'planName',
        'qty',
        'price',
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

        this.http.get(this.configService.getPlansUrl(), this.httpOptions)
            .subscribe(response => {
                this.plansList = response;
                if (this.plansList.length > 0) {
                    for (const plansData of this.plansList) {
                        this.http.get(this.configService.getCoursePlansByIdUrl(plansData.id), this.httpOptions)
                            .subscribe( response2 => {
                                this.courseData = response2;
                                plansData.courseName = this.courseData.courseName;
                            }, error2 => {
                                this.navigationService.changeUrl('plans');
                            });
                        if (plansData.byLesson && !plansData.byMonth) {
                            plansData.qty = plansData.qty + ' lesson(s)';
                        } else {
                            plansData.qty = plansData.qty + ' month(s)';
                        }
                    }
                }
                this.progressMode = 'determinate';
                this.progressValue = 100;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.plansList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }, error => {
                this.navigationService.changeUrl('plans');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('plans/create');
    }

    view(row) {
        this.navigationService.changeUrl('plans/' + row.id);
    }
}

export interface PeriodicElement {
    courseName: string;
    planName: string;
    qty: number;
    price: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
