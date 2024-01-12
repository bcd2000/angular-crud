import { HelperService } from './helper.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuradService implements CanActivate {

  constructor(private router: Router, private helperService: HelperService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userList = this.helperService.getUserListLocalStorage()
    const currentUser = JSON.parse(this.helperService.getCurrentUserLocalStorage())
    if(!currentUser) return this.router.createUrlTree(['/login'])


    const user = JSON.parse(userList).find((item: { email: string; password: string; }) => {
      return item.email === currentUser.email && item.password === currentUser.password
    })
    if (!user) {
      return this.router.createUrlTree(['/login'])
    }
    return true
  }
}
