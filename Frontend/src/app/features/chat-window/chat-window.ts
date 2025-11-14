
import { Component, OnInit ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DUMMY_CHATS, Chat } from '../../data/chat-data';

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
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatWindow implements OnInit {
  chat: Chat | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  showPicker = false;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get chat ID from route params
    this.route.params.subscribe(params => {
      const chatId = params['id'];
      this.chat = DUMMY_CHATS.find(c => c.id === chatId) || null;
      
      if (this.chat) {
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    // Sample messages - replace with real data
    this.messages = [
      {
        id: 1,
        text: "Hey! How are you doing?",
        sender: 'other',
        timestamp: '10:30 AM'
      },
      {
        id: 2,
        text: "I'm doing great! Thanks for asking 😊",
        sender: 'me',
        timestamp: '10:32 AM',
        status: 'read'
      },
      {
        id: 3,
        text: "That's wonderful to hear!",
        sender: 'other',
        timestamp: '10:33 AM'
      },
      {
        id: 4,
        text: "Are we still on for the meeting tomorrow?",
        sender: 'other',
        timestamp: '10:35 AM'
      },
      {
        id: 5,
        text: "Yes, absolutely! I'll be there at 2 PM.",
        sender: 'me',
        timestamp: '10:36 AM',
        status: 'delivered'
      }
    ];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: this.messages.length + 1,
        text: this.newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: 'sent'
      };
      
      this.messages.push(message);
      this.newMessage = '';
      
      // Simulate typing indicator
      this.simulateTyping();
      
      // Scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
    }
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
}