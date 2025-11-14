import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from './service/auth-api';
import { AuthLocalStorage } from './service/auth-local-storage';
import { ErrorCategory } from '../core/core.model';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);
  const authStorage = inject(AuthLocalStorage);

  let refreshTokenInProgress = false;
  const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

  // Attach access token if available
  req = addAuthHeader(req, authStorage);
  // return next(req);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err && err.status === 401) {
        // Token expired or unauthorized
        const refreshReq = authApi.getRefreshRequest();

        if (err.error && err.error.errorCategory === ErrorCategory.LOGIN_401) {
          // Do nothing for login form
          console.log('in login');
        } else {
          if (!err.error) {
            if (refreshTokenInProgress) {
              return refreshTokenSubject.pipe(
                filter((result) => result !== null),
                take(1),
                switchMap(() => next(addAuthHeader(req, authStorage)))
              );
            } else {
              console.log('TOKEN EXPIRED!!');
              refreshTokenInProgress = true;

              refreshTokenSubject.next(null);
              console.log('sending the refresh token request from the interceptor...');
              return authApi.refreshToken(refreshReq).pipe(
                switchMap(() => {
                  refreshTokenSubject.next(true);
                  return next(addAuthHeader(req, authStorage));
                }),
                catchError((error) => {
                  console.log('catch switch', error);
                  router.navigate(['/login']);
                  return throwError(() => new Error('Session expired. Please login again.'));
                }),
                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                finalize(() => (refreshTokenInProgress = false))
              );
            }
          } else {
            authApi.logout();
          }
        }
      }
      return throwError(() => err);
    })
  );
};

// Helper function to add Authorization header
const addAuthHeader = (request: HttpRequest<any>, storage: AuthLocalStorage) => {
  const token = storage.getAccessToken();
  console.log('token value in the interceptor', token);
  if (!token?.accessToken) return request;

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
};
