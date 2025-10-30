import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';

export const authRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'verify', loadComponent: () => import('./verify-email/verify-email').then(m => m.VerifyEmail) }
];