import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,tap } from 'rxjs';
import { AuthLocalStorage } from './auth-local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private baseUrl = 'https://localhost:7059/api/Account';

  constructor(private http: HttpClient ,private localStorageService:AuthLocalStorage) { }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, { email });
  }

  verifyOtpAndRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, data);
  } 

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
        tap((resp) => {
          console.log(resp);
          this.localStorageService.setAccessAndRefreshToken(resp.accessToken, resp.accessTokenExpiration, resp.refreshToken);
        })
      );
  }
}
