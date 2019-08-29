import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private dataSource: any;
    private lessonsList: any;
    private classData: any;
    private courseData: any;

    displayedColumns: string[] = ['className', 'courseName', 'date', 'session', 'startTime', 'endTime', 'createDate', 'updateDate', 'active'];

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
        this.http.get(this.configService.getLessonsUrl(), this.httpOptions)
            .subscribe(response => {
                this.lessonsList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.lessonsList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                if (this.lessonsList.length > 0) {
                    for (const lessonsData of this.lessonsList) {
                        this.http.get(this.configService.getLessonsClassByIdUrl(lessonsData.id), this.httpOptions)
                            .subscribe(classResponse => {
                                this.classData = classResponse;
                                lessonsData.className = this.classData.displayName;
                            }, error2 => {
                                this.navigationService.changeUrl('lessons');
                            });
                        this.http.get(this.configService.getLessonsCourseByIdUrl(lessonsData.id), this.httpOptions)
                            .subscribe(courseResponse => {
                                this.courseData = courseResponse;
                                lessonsData.courseName = this.courseData.courseName;
                            }, error2 => {
                                this.navigationService.changeUrl('lessons');
                            });
                    }
                }
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('lessons');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    view(row) {
        this.navigationService.changeUrl('lessons/' + row.id);
    }

}

export interface PeriodicElement {
    className: string;
    courseName: string;
    date: string;
    session: number;
    startTime: string;
    endTime: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
