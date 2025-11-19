import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatApi {
  
  constructor(private httpclient :HttpClient) { } 

  getUsers():Observable<any>{
    return this.httpclient.get(`${environment.apiBaseUrl}/users`);
  }
}
