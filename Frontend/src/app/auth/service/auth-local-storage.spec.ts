import { TestBed } from '@angular/core/testing';

import { AuthLocalStorage } from './auth-local-storage';

describe('AuthLocalStorage', () => {
  let service: AuthLocalStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLocalStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
