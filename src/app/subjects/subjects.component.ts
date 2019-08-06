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
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

    private httpOptions: any;
    private subjectList: any;
    private noRecord: boolean;
    private dataSource: any;

    displayedColumns: string[] = ['display_name', 'code', 'create_date', 'update_date', 'active'];

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

        this.http.get(this.configService.getSubjectsUrl(), this.httpOptions)
            .subscribe(response => {
                this.subjectList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.subjectList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }, error => {
                this.router.navigateByUrl('/');
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    create() {
        this.navigationService.changeUrl('/subjects/create');
    }

    view(row) {
        this.navigationService.changeUrl('/subjects/' + row.id);
    }

}

export interface PeriodicElement {
    display_name: string;
    code: string;
    create_date: string;
    // create_by: string;
    update_date: string;
    // update_by: string;
    active: boolean;
}
