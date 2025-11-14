import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApi } from './service/auth-api';
import { of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Capture the return URL from current navigation
  const returnUrl = state.url;

  return inject(AuthApi).isAuthenticated().pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
         return of(router.createUrlTree(['/login'], {
          queryParams: { returnUrl },
        }));
      }
      return of(authenticated);
    })
  );
};
