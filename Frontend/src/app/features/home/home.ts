
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DUMMY_CHATS, Chat } from '../../data/chat-data';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  chats: Chat[] = [];
  filteredChats: Chat[] = [];
  searchQuery: string = '';
  activeFilter: 'all' | 'unread' | 'groups' = 'all';
  unreadCount: number = 0;

  ngOnInit() {
    // Load all non-archived chats
    this.chats = DUMMY_CHATS.filter((chat:any) => !chat.isArchived);
    this.filteredChats = [...this.chats];
    this.calculateUnreadCount();
  }

  filterChats() {
    let result = [...this.chats];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(chat => 
        chat.name.toLowerCase().includes(query) || 
        chat.lastMessage.toLowerCase().includes(query)
      );
    }

    // Apply active filter
    switch (this.activeFilter) {
      case 'unread':
        result = result.filter(chat => chat.unreadCount > 0);
        break;
      case 'groups':
        result = result.filter(chat => chat.type === 'group');
        break;
      case 'all':
      default:
        // Show all (already filtered by search)
        break;
    }

    this.filteredChats = result;
  }

  setFilter(filter: 'all' | 'unread' | 'groups') {
    this.activeFilter = filter;
    this.filterChats();
  }

  toggleFavorite(chat: Chat, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    chat.isFavorite = !chat.isFavorite;
  }

  calculateUnreadCount() {
    this.unreadCount = this.chats.reduce((count, chat) => count + chat.unreadCount, 0);
  }
}