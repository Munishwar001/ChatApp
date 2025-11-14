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
        redirectTo: 'chats'
      },
      {
        path: 'chats',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
      },
      {
        path: 'chat/:id',
        loadComponent: () => import('./features/chat-window/chat-window').then(m => m.ChatWindow)
      },
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
