import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  public signup(body: User): Observable<{ message: string, result: User }> {
    return this._http.post('http://localhost:8080/api/user/signup', body) as Observable<{ message: string, result: User }>;
  }

  public login(body: User): Observable<{ token: string, result: User }> {
    return this._http.post('http://localhost:8080/api/user/login', body) as Observable<{ token: string, result: User }>;
  }

  public storeAuthData(token: string, userId: string, userName: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
  }

  public clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  public getAuthData(): { token: string | null, userId: string | null, userName: string | null } {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName')
    }
  }

  public changeUserName(userName: string) {
    localStorage.setItem('userName', userName);
  }

  public isAuthenticated(): boolean {
    return this.getAuthData().token !== null;
  }

  public getUserData(): Observable<User> {
    return this._http.get(`http://localhost:8080/api/user/${this.getAuthData().userId}`) as Observable<User>;
  }

  public updateUserData(body: User): Observable<{ message: string, user: User }> {
    return this._http.put(`http://localhost:8080/api/user/${this.getAuthData().userId}/change`, body) as Observable<{ message: string, user: User }>;
  }

  public deleteUser(): Observable<{ message: string }> {
    return this._http.delete(`http://localhost:8080/api/user/${this.getAuthData().userId}/delete`) as Observable<{ message: string }>;
  }
}
