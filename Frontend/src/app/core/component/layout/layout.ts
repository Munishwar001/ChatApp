import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/component/sidebar/sidebar';
import { MobileHeader } from '../../../shared/component/mobile-header/mobile-header';
import { ChatApi } from '../../../services/chat-api';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../../store/user/user.actions';
import { selectLoggedUser, selectAllUsers } from '../../../store/user/user.selectors';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, MobileHeader, AsyncPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  @ViewChild(Sidebar) sidebar!: Sidebar;

  pageTitle = 'All Chats';
  loggedUser$: any;
  users$: any;

  constructor(private chatService: ChatApi, private store: Store ,private http: HttpClient) {
    console.log('chatService = ', this.chatService);
    console.log('getUsers = ', this.chatService.getUsers);
  }
  

  ngOnInit() {
    this.loggedUser$ = this.store.select(selectLoggedUser);
    // this.users$ = this.store.select(selectAllUsers);
    this.loggedUser$.subscribe((user: any) => {
      console.log('Actual Logged User:', user);
    });
    this.sendMessage(); 
    this.store.dispatch(loadUsers());
  }
 
  sendMessage() {
  const testMessage = "Hello, this is a test message from Angular";

  this.http.post(
    'https://localhost:7059/api/chat/ask', 
    { message: testMessage },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .subscribe({
    next: (res) => console.log("Chat Response:", res),
    error: (err) => {
      console.error("Chat API Error:", err);
      console.error("Error details:", err.error);
      console.error("Status:", err.status);
    }
  });
}

  onMenuToggle() {
    if (this.sidebar) {
      this.sidebar.toggleSidebar();
    }
  }

  updatePageTitle(title: string) {
    this.pageTitle = title;
  }

  fetchUsers() {
    this.chatService.getUsers().subscribe((users) => {
      console.log(users);
    });
  }
}
