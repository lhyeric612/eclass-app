import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

    private httpOptions: any;
    private levelList: any;
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

        this.http.get(this.configService.getLevelsUrl(), this.httpOptions)
            .subscribe(response => {
                this.levelList = response;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.levelList);
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
        this.router.navigateByUrl('/levels/create');
    }

    view(row) {
        this.router.navigateByUrl('/levels/' + row.id);
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
