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
import {
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule
} from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { UsersComponent } from './users/users.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { SubjectsCreateComponent } from './subjects-create/subjects-create.component';
import { SubjectsDetailsComponent } from './subjects-details/subjects-details.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LevelsComponent } from './levels/levels.component';
import { LevelsCreateComponent } from './levels-create/levels-create.component';
import { LevelsDetailsComponent } from './levels-details/levels-details.component';
import { ClassesComponent } from './classes/classes.component';
import { ClassesCreateComponent } from './classes-create/classes-create.component';
import { ClassesDetailsComponent } from './classes-details/classes-details.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TeachersCreateComponent } from './teachers-create/teachers-create.component';
import { TeachersDetailsComponent } from './teachers-details/teachers-details.component';
import { ParentsComponent } from './parents/parents.component';
import { ParentsCreateComponent } from './parents-create/parents-create.component';
import { ParentsDetailsComponent } from './parents-details/parents-details.component';
import { StudentsComponent } from './students/students.component';
import { StudentsCreateComponent } from './students-create/students-create.component';
import { StudentsDetailsComponent } from './students-details/students-details.component';
import { CoursesComponent } from './courses/courses.component';
import { CoursesCreateComponent } from './courses-create/courses-create.component';
import { CoursesDetailsComponent } from './courses-details/courses-details.component';
import { LogoutComponent } from './logout/logout.component';
import { PlansComponent } from './plans/plans.component';
import { PlansCreateComponent } from './plans-create/plans-create.component';
import { PlansDetailsComponent } from './plans-details/plans-details.component';
import { LessonScheduleComponent } from './lesson-schedule/lesson-schedule.component';
import { LessonScheduleCreateComponent } from './lesson-schedule-create/lesson-schedule-create.component';
import { LessonScheduleDetailsComponent } from './lesson-schedule-details/lesson-schedule-details.component';
import { ScreenlockComponent } from './screenlock/screenlock.component';
import { FooterComponent } from './footer/footer.component';
import { LessonsComponent } from './lessons/lessons.component';
import { LessonsDetailsComponent } from './lessons-details/lessons-details.component';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'users/create', component: UsersCreateComponent },
    { path: 'users/:id', component: UsersDetailsComponent },
    { path: 'subjects', component: SubjectsComponent },
    { path: 'subjects/create', component: SubjectsCreateComponent },
    { path: 'subjects/:id', component: SubjectsDetailsComponent },
    { path: 'levels', component: LevelsComponent },
    { path: 'levels/create', component: LevelsCreateComponent },
    { path: 'levels/:id', component: LevelsDetailsComponent },
    { path: 'classes', component: ClassesComponent },
    { path: 'classes/create', component: ClassesCreateComponent },
    { path: 'classes/:id', component: ClassesDetailsComponent },
    { path: 'teachers', component: TeachersComponent },
    { path: 'teachers/create', component: TeachersCreateComponent },
    { path: 'teachers/:id', component: TeachersDetailsComponent },
    { path: 'parents', component: ParentsComponent },
    { path: 'parents/create', component: ParentsCreateComponent },
    { path: 'parents/:id', component: ParentsDetailsComponent },
    { path: 'students', component: StudentsComponent },
    { path: 'students/create', component: StudentsCreateComponent },
    { path: 'students/:id', component: StudentsDetailsComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'courses/create', component: CoursesCreateComponent },
    { path: 'courses/:id', component: CoursesDetailsComponent },
    { path: 'plans', component: PlansComponent },
    { path: 'plans/create', component: PlansCreateComponent },
    { path: 'plans/:id', component: PlansDetailsComponent },
    { path: 'lesson-schedule', component: LessonScheduleComponent },
    { path: 'lesson-schedule/create', component: LessonScheduleCreateComponent },
    { path: 'lesson-schedule/:id', component: LessonScheduleDetailsComponent },
    { path: 'lessons', component: LessonsComponent },
    { path: 'lessons/:id', component: LessonsDetailsComponent },
    
    { path: 'screenlock',      component: ScreenlockComponent },
    { path: 'logout',      component: LogoutComponent },
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
    UsersCreateComponent,
    UsersDetailsComponent,
    SubjectsComponent,
    SubjectsCreateComponent,
    SubjectsDetailsComponent,
    LevelsComponent,
    LevelsCreateComponent,
    LevelsDetailsComponent,
    ClassesComponent,
    ClassesCreateComponent,
    ClassesDetailsComponent,
    TeachersComponent,
    TeachersCreateComponent,
    TeachersDetailsComponent,
    ParentsComponent,
    ParentsCreateComponent,
    ParentsDetailsComponent,
    StudentsComponent,
    StudentsCreateComponent,
    StudentsDetailsComponent,
    CoursesComponent,
    CoursesCreateComponent,
    CoursesDetailsComponent,
    LogoutComponent,
    PlansComponent,
    PlansCreateComponent,
    PlansDetailsComponent,
    LessonScheduleComponent,
    LessonScheduleCreateComponent,
    LessonScheduleDetailsComponent,
    ScreenlockComponent,
    FooterComponent,
    LessonsComponent,
    LessonsDetailsComponent
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
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        NgxMaterialTimepickerModule,
        MatCheckboxModule
    ],
  providers: [ CookieService, MatDatepickerModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
