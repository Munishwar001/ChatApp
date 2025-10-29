import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
 export const routes: Routes = [
    {path:"register",component:Register},
    {path:"login" ,component:Login},
 ];
