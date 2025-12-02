import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Message } from '../models/chat.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ChatApi {
  constructor(private httpclient: HttpClient) {}

  getUsers(): Observable<any> {
    return this.httpclient.get(`${environment.apiBaseUrl}/users`);
  }

  getMessages(chatId: string) {
    return this.httpclient.get<Message[]>(`${environment.apiBaseUrl}/chat/messages/${chatId}`);
  }

  sendMessage(data: any) {
    return this.httpclient.post<any>(`${environment.apiBaseUrl}/chat/send`, data);
  }

  createOrGetChat(user1: string | null, user2: string | undefined ,isAi:Boolean): Observable<string> {
    const payload = { user1, user2 ,isAi};
    console.log('createOrGetChat payload = ', payload);
    return this.httpclient.post<{ chatId: string }>(`${environment.apiBaseUrl}/chat/create-or-get`, payload) .pipe(map(res => res.chatId));;
  }
}
