import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

    progressMode = 'indeterminate';
    progressValue = 0;

    private httpOptions: any;
    private levelList: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = ['displayName', 'code', 'createDate', 'updateDate', 'active'];

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

        this.http.get(this.configService.getClassesUrl(), this.httpOptions)
            .subscribe(response => {
                this.levelList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.levelList);
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
        this.navigationService.changeUrl('/classes/create');
    }

    view(row) {
        this.navigationService.changeUrl('/classes/' + row.id);
    }

}

export interface PeriodicElement {
    displayName: string;
    code: string;
    createDate: string;
    updateDate: string;
    active: boolean;
}
