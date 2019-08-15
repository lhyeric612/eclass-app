import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private basicUrl = 'http://localhost:3000/';

    constructor() { }

    // Users API
    getUserUrl() {
        return this.basicUrl + 'users';
    }

    getLoginUrl() {
        return this.basicUrl + 'users/login';
    }

    getUserMeUrl() {
        return this.basicUrl + 'users/me';
    }

    getUserRoleUrl(id: string) {
        return this.basicUrl + 'users/' + id + '/role';
    }

    getUserByIdUrl(id: string) {
        return this.basicUrl + 'users/' + id;
    }

    // Roles API
    getRoleUrl() {
        return this.basicUrl + 'roles';
    }

    // Subjects API
    getSubjectsUrl() {
        return this.basicUrl + 'subjects';
    }

    getSubjectByIdUrl(id: string) {
        return this.basicUrl + 'subjects/' + id;
    }

    // Levels API
    getLevelsUrl() {
        return this.basicUrl + 'levels';
    }

    getLevelByIdUrl(id: string) {
        return this.basicUrl + 'levels/' + id;
    }

    // Classes API
    getClassesUrl() {
        return this.basicUrl + 'classes';
    }

    getClassesByIdUrl(id: string) {
        return this.basicUrl + 'classes/' + id;
    }

    // Teachers API
    getTeachersUrl() {
        return this.basicUrl + 'teachers';
    }

    getTeacherByIdUrl(id: string) {
        return this.basicUrl + 'teachers/' + id;
    }

    // Parents API
    getParentsUrl() {
        return this.basicUrl + 'parents';
    }

    getParentByIdUrl(id: string) {
        return this.basicUrl + 'parents/' + id;
    }

    getParentsStudentsUrl(id: string) {
        return this.basicUrl + 'parents/' + id + '/students';
    }

    // Students API
    getStudentsUrl() {
        return this.basicUrl + 'students';
    }

    getStudentByIdUrl(id: string) {
        return this.basicUrl + 'students/' + id;
    }

    // Courses API
    getCoursesUrl() {
        return this.basicUrl + 'courses';
    }

    getCourseByIdUrl(id: string) {
        return this.basicUrl + 'courses/' + id;
    }

    getCourseSubjectByIdUrl(id: string) {
        return this.basicUrl + 'courses/' + id + '/subjects';
    }

    getCourseLevelByIdUrl(id: string) {
        return this.basicUrl + 'courses/' + id + '/levels';
    }

    // Plans API

    getPlansUrl() {
        return this.basicUrl + 'course-plans';
    }

    getPlansByIdUrl(id: string) {
        return this.basicUrl + 'course-plans/' + id;
    }

    getCoursePlansByIdUrl(id: string) {
        return this.basicUrl + 'course-plans/' + id + '/courses';
    }

    // Lesson Schedule API

    getLessonScheduleUrl() {
        return this.basicUrl + 'lesson-schedules';
    }

    getLessonScheduleByIdUrl(id: string) {
        return this.basicUrl + 'lesson-schedules/' + id;
    }

    getLessonScheduleClassByIdUrl(id: string) {
        return this.basicUrl + 'lesson-schedules/' + id + '/classes';
    }

    getLessonScheduleCourseByIdUrl(id: string) {
        return this.basicUrl + 'lesson-schedules/' + id + '/courses';
    }
}
