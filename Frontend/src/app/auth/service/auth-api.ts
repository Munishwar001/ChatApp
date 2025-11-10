import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private baseUrl = 'https://localhost:7059/api/Account';

  constructor(private http: HttpClient) { }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, { email });
  }

  verifyOtpAndRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, data);
  }
}
