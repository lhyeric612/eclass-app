import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { MatAutocompleteModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { UsersComponent } from './users/users.component';
import { UsersCreateComponent } from './users-create/users-create.component';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'users/create', component: UsersCreateComponent },
    // { path: 'hero/:id',      component: HeroDetailComponent },
    // {
    //     path: 'heroes',
    //     component: HeroListComponent,
    //     data: { title: 'Heroes List' }
    // },
    // { path: '',
    //     redirectTo: '/heroes',
    //     pathMatch: 'full'
    // },
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavComponent,
    TopNavComponent,
    UsersComponent,
    UsersCreateComponent
  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: true} // <-- debugging purposes only
        ),
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FontAwesomeModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
