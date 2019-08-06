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

    getUserRoleUrl(id) {
        return this.basicUrl + 'users/' + id + '/role';
    }

    getUserByIdUrl(id) {
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

    getSubjectByIdUrl(id) {
        return this.basicUrl + 'subjects/' + id;
    }

    // Levels API
    getLevelsUrl() {
        return this.basicUrl + 'levels';
    }

    getLevelByIdUrl(id) {
        return this.basicUrl + 'levels/' + id;
    }

    // Classes API
    getClassesUrl() {
        return this.basicUrl + 'classes';
    }

    getClassesByIdUrl(id) {
        return this.basicUrl + 'classes/' + id;
    }

    // Teachers API
    getTeachersUrl() {
        return this.basicUrl + 'teachers';
    }

    getTeacherByIdUrl(id) {
        return this.basicUrl + 'teachers/' + id;
    }

    // Parents API
    getParentsUrl() {
        return this.basicUrl + 'parents';
    }

    getParentByIdUrl(id) {
        return this.basicUrl + 'teachers/' + id;
    }

    getParentsStudentsUrl(id) {
        return this.basicUrl + 'parents/' + id + '/students';
    }

}
