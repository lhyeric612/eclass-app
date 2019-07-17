import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    // { path: 'crisis-center', component: CrisisListComponent },
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
    DashboardComponent
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
        ToastrModule.forRoot()
    ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
