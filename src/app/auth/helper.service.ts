import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  setUserListLocalStorage(userInfo: any) {
    localStorage.setItem('USER_LIST', JSON.stringify(userInfo))
  }

  getUserListLocalStorage() {
    return JSON.parse(JSON.stringify(localStorage.getItem('USER_LIST')))
  }

  setCurrentUserLocalStorage(curUser: any) {
    localStorage.setItem('CURRENT_USER', JSON.stringify(curUser))
  }

  getCurrentUserLocalStorage() {
    return JSON.parse(JSON.stringify(localStorage.getItem('CURRENT_USER')))
  }

  removeCurrentUserLocalStorage() {
    localStorage.removeItem('CURRENT_USER')
  }
}
