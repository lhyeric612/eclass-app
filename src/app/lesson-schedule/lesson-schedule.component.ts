import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-lesson-schedule',
  templateUrl: './lesson-schedule.component.html',
  styleUrls: ['./lesson-schedule.component.css']
})
export class LessonScheduleComponent implements OnInit {

  progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private dataSource: any;
    private lessonScheduleList: any;
    private classData: any;
    private courseData: any;

    displayedColumns: string[] = ['title', 'className', 'courseName', 'status', 'createDate', 'updateDate'];

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
        this.http.get(this.configService.getLessonScheduleUrl(), this.httpOptions)
            .subscribe(response => {
                this.lessonScheduleList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.lessonScheduleList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                if (this.lessonScheduleList.length > 0) {
                    for (const lessonScheduleData of this.lessonScheduleList) {
                        this.http.get(this.configService.getLessonScheduleClassByIdUrl(lessonScheduleData.id), this.httpOptions)
                            .subscribe(classResponse => {
                                this.classData = classResponse;
                                lessonScheduleData.className = this.classData.displayName;
                            }, error2 => {
                                this.navigationService.changeUrl('lesson-schedule');
                            });
                        this.http.get(this.configService.getLessonScheduleCourseByIdUrl(lessonScheduleData.id), this.httpOptions)
                            .subscribe(courseResponse => {
                                this.courseData = courseResponse;
                                lessonScheduleData.courseName = this.courseData.courseName;
                            }, error2 => {
                                this.navigationService.changeUrl('lesson-schedule');
                            });
                    }
                }
                this.progressMode = 'determinate';
                this.progressValue = 100;
            }, error => {
                this.navigationService.changeUrl('lesson-schedule');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('lesson-schedule/create');
    }

    view(row) {
        this.navigationService.changeUrl('lesson-schedule/' + row.id);
    }

}

export interface PeriodicElement {
    title: string;
    className: string;
    courseName: string;
    status: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
