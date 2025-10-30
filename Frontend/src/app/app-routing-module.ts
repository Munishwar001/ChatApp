import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () => import('./Component/home/home').then(m => m.Home)
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
   {
      path: '**',
      loadComponent: () => import('./Component/not-found/not-found').then(m => m.NotFound)
   }
];
