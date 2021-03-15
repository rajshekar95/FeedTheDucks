import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Users } from './models/Users';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Users>;
  public currentUser: Observable<Users>;
  serviceUrl : string = "http://localhost:80";
  constructor(private http: HttpClient,  private router: Router) { 
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('fwCurrentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Users {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {

    return this.http.post<any>(`${this.serviceUrl}/users/login`, { email, password })
        .pipe(map(userInfo => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            if(userInfo.status === 'success'){
              localStorage.setItem('fwCurrentUser', JSON.stringify(userInfo.data));
              localStorage.setItem('fwToken', userInfo.token);
              localStorage.setItem('fwUsername' , userInfo.data.personFullName);
              localStorage.setItem('fwRole', userInfo.data.role);
              localStorage.setItem('fwId', userInfo.data.id);
              this.currentUserSubject.next(userInfo.data);
              return userInfo;
            }else{
               throwError(userInfo.error);
            }
        }));
}
register(userData : any){
  return this.http.post<any>(`${this.serviceUrl}/users/register`, userData )
  .pipe(map(userInfo => {
      // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
      if(userInfo.status === 'success'){
        localStorage.setItem('fwCurrentUser', JSON.stringify(userInfo.data));
        localStorage.setItem('fwToken', userInfo.token);
        localStorage.setItem('fwUsername' , userInfo.data.personFullName);
        localStorage.setItem('fwRole', userInfo.data.role);
        localStorage.setItem('fwId', userInfo.data.id);
        this.currentUserSubject.next(userInfo.data);
        return userInfo;
      }else{
         throwError(userInfo.error);
      }
  }));
}

logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('fwCurrentUser');
    localStorage.removeItem('fwToken');
    localStorage.removeItem('fwUsername');
    localStorage.removeItem('fwRole');
    localStorage.removeItem('fwId');
    
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
}

}
