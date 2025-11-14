import { Injectable } from '@angular/core';
import ls from 'localstorage-slim';
import { environment } from '../../../environments/environment';
interface LocalStorage {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
  selectedSubOrg?: number;
}
const StorageString = 'atost';

@Injectable({
  providedIn: 'root',
})
export class AuthLocalStorage {
  constructor() {
    ls.config = {
      encrypt: true,
      secret: environment.tokenKey,
    };
  }

  private get currentStorage(): LocalStorage {
    const storedData = ls.get(StorageString, { decrypt: true }) as LocalStorage;
    // Return an empty object if nothing is found
    return (
      storedData ||
      ({ accessToken: '', refreshToken: '', accessTokenExpiration: '' } as LocalStorage)
    );
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

  // --- Auth-specific methods ---
  setAuthTokens(accessToken: string, accessTokenExpiration: string, refreshToken: string): void {
    const data: LocalStorage = {
      accessToken,
      accessTokenExpiration,
      refreshToken,
    };
    ls.set(StorageString, data, { encrypt: true });
  }

  getAccessToken(): any | null {
    const storage = this.currentStorage;
    if (storage.accessToken && storage.accessTokenExpiration) {
      return {
        accessToken: storage.accessToken,
        accessTokenExpiration: storage.accessTokenExpiration,
      };
    }
    return null;
  }

  getRefreshToken(): string | null {
    return this.currentStorage.refreshToken || null;
  }

  clearAuthData(): void {
    ls.remove(StorageString);
  }
}
