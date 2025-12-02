import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DUMMY_CHATS, Chat } from '../../data/chat-data';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllChats, selectLoggedUser } from '../../store/user/user.selectors';
import { ChatApi } from '../../services/chat-api';
import { map, filter } from 'rxjs/operators';
import { AI_USER_ID } from '../../constants';
interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatWindow implements OnInit {
  chat: Chat | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  showPicker = false;
  isAIChat: boolean = false;
  currentUserId: string | null = null;
  chatId: string | null = null;
  showImagePreview: boolean = false; 

  constructor(private route: ActivatedRoute, private store: Store, private chatService: ChatApi) {}

  ngOnInit() {
    console.log('ChatWindow initialized');
    const loggedUser$ = this.store.select(selectLoggedUser).pipe(filter((user) => !!user));
    const routeParams$ = this.route.params.pipe(
      map((params) => {
      const chatUserId = params['id'];
      this.isAIChat = chatUserId === AI_USER_ID;
      return chatUserId;
    }),
      filter((chatUserId) => !!chatUserId)
    );
    const allChats$ = this.store.select(selectAllChats);

    combineLatest([loggedUser$, routeParams$, allChats$]).subscribe(([user, chatUserId, chats]) => {
      this.currentUserId = user.id;

      // Find the chat object for the UI
      this.chat = chats.find((c) => c.id === chatUserId) || null;

      this.chatService.createOrGetChat(this.currentUserId, chatUserId ,this.isAIChat).subscribe((chatId) => {
        this.chatId = chatId;
        this.loadMessages(chatId);
      });
    });
  }

  loadMessages(chatId: string) {
    console.log('Loading messages for chat ID: ' + chatId);
    this.chatService.getMessages(chatId).subscribe({
      next: (messages: any[]) => {
        // Map backend messages to front-end model
        this.messages = messages.map((msg) => ({
          id: msg.messageId,
          text: msg.messageText,
          sender: msg.senderId === this.currentUserId ? 'me' : 'other',
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'sent',
        }));

        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err: any) => {
        console.error('Error loading messages', err);
      },
    });
  }

  sendMessage() {
    if (!this.newMessage || this.newMessage.trim() === '') {
      return;
    }

    const payload = {
      chatId: this.chatId,
      senderId: this.currentUserId,
      messageText: this.newMessage,
      messageType: 'text',
    };

    console.log('Sending message payload:', payload);
    this.chatService.sendMessage(payload).subscribe((message) => {
      this.messages.push(message);

      this.newMessage = '';
      this.loadMessages(this.chatId!);
      // this.simulateTyping();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  simulateTyping() {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
    }, 2000);
  }

  scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  addEmoji(event: any) {
    this.newMessage += event.detail.unicode;
  }

   openImagePreview() {
    this.showImagePreview = true;
  }

  closeImagePreview() {
    this.showImagePreview = false;
  }
}
