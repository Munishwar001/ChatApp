import { Injectable } from '@angular/core';
import ls from 'localstorage-slim';
@Injectable({
  providedIn: 'root'
})
export class AuthLocalStorage {
  private encryptionKey = 'chatspace_secret_key';

  constructor() {
    ls.config = {
      encrypt: true,
      secret: this.encryptionKey,
    };
  }

  setItem(key: string, value: any): void {
    ls.set(key, value, { encrypt: true });
  }

  getItem<T>(key: string): T | null {
    return ls.get(key, { decrypt: true }) as T;
  }

  removeItem(key: string): void {
    ls.remove(key);
  }

  clear(): void {
    ls.clear();
  }
}
