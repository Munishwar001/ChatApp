import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, switchMap, catchError } from 'rxjs';
import { AuthLocalStorage } from './auth-local-storage';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private baseUrl = `${environment.apiBaseUrl}/Account`;

  constructor(private http: HttpClient, private localStorageService: AuthLocalStorage ,private router:Router) {}

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, { email });
  }

  verifyOtpAndRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.localStorageService.setAuthTokens(
          resp.accessToken,
          resp.accessTokenExpiration,
          resp.refreshToken
        );
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    if (this.isAccessTokenValid()) {
      console.log('Not expired message by auth guard');
      return of(true);
    } else {
      console.log('Expired message by auth guard');

      let refreshReq = this.getRefreshRequest();

      if (refreshReq.accessToken && refreshReq.refreshToken) {
        alert("request sending for the refresh token");
        return this.refreshToken(this.getRefreshRequest()).pipe(
          switchMap(() => {
            return of(true);
          }),
          catchError(() => {
            return of(false);
          })
        );
      } else {
        return of(false);
      }
    }
  }
  
   revokeRefreshToken() {
    console.log('revoking...');
    let currentRefreshToken = this.localStorageService.getRefreshToken();
    return this.http.post<boolean>(`${this.baseUrl}/revoke-token`, { refreshToken: currentRefreshToken });
  }

  isAccessTokenValid() {
    let token = this.localStorageService.getAccessToken();
    console.log('access toke expire => ' + token?.accessTokenExpiration);

    const currentDatetime = new Date();
    console.log('current datetime => ' + currentDatetime);
    if (token && new Date(token.accessTokenExpiration) > currentDatetime) {
      return true;
    } else {
      return false;
    }
  }

  getRefreshRequest(): any {
    let refreshReq: any = { accessToken: '', refreshToken: '' };

    let currentAccessToken = this.localStorageService.getAccessToken();
    if (currentAccessToken) refreshReq.accessToken = currentAccessToken.accessToken;

    let currentRefreshToken = this.localStorageService.getRefreshToken();
    if (currentRefreshToken) refreshReq.refreshToken = currentRefreshToken;

    return refreshReq;
  }

  refreshToken(refreshRequest: any) {
    return this.http
      .post<any>(`${this.baseUrl}/refresh-token`, refreshRequest)
      .pipe(
        tap((resp) => {
          this.localStorageService.setAuthTokens(
            resp.accessToken,
            resp.accessTokenExpiration,
            resp.refreshToken
          );
        })
      );
  }

  logout(){
     console.log("logout function triggered");
      this.localStorageService.clear();
      this.router.navigate(['/login']);
  }
}
