import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private basicUrl = 'http://localhost:3000/';
    private loginUrl: string;
    private userMeUrl: string;
    private userRoleUrl: string;
    private userListUrl: string;
    private roleListUrl: string;

    constructor() { }

    getLoginUrl() {
        this.loginUrl = this.basicUrl + 'users/login';
        return this.loginUrl;
    }

    getUserMeUrl() {
        this.userMeUrl = this.basicUrl + 'users/me';
        return this.userMeUrl;
    }

    getUserRoleUrl(userId) {
        this.userRoleUrl = this.basicUrl + 'users/' + userId + '/role';
        return this.userRoleUrl;
    }

    getUserListUrl() {
        this.userListUrl = this.basicUrl + 'users';
        return this.userListUrl;
    }

    getRoleUrl() {
        this.roleListUrl = this.basicUrl + 'roles';
        return this.roleListUrl;
    }

}
