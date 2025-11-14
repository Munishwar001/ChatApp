import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/component/layout/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
      },
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      // },
      // {
      //   path: 'profile',
      //   loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
      // }
    ]
  },

  // Auth routes (login, signup)
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },

  // 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
  }
];
