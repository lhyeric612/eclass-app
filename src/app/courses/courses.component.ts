import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private courseList: any;
    private dataSource: any;
    private subjectData: any;
    private levelData: any;

    displayedColumns: string[] = ['subject', 'level', 'courseName', 'createDate', 'updateDate', 'active'];

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
        this.http.get(this.configService.getCoursesUrl(), this.httpOptions)
            .subscribe(response => {
                this.courseList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.courseList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                if (this.courseList.length > 0) {
                    for (const courseData of this.courseList) {
                        this.http.get(this.configService.getCourseSubjectByIdUrl(courseData.id), this.httpOptions)
                            .subscribe(subjectResponse => {
                                this.subjectData = subjectResponse;
                                courseData.subject = this.subjectData.displayName;
                            }, error2 => {
                                this.navigationService.changeUrl('courses');
                            });
                        this.http.get(this.configService.getCourseLevelByIdUrl(courseData.id), this.httpOptions)
                            .subscribe(levelResponse => {
                                this.levelData = levelResponse;
                                courseData.level = this.levelData.displayName;
                            }, error2 => {
                                this.navigationService.changeUrl('courses');
                            });
                    }
                }
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('courses');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('courses/create');
    }

    view(row) {
        this.navigationService.changeUrl('courses/' + row.id);
    }

}

export interface PeriodicElement {
    subject: string;
    level: string;
    courseName: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
