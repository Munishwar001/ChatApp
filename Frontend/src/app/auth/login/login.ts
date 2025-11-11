import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
import player from 'lottie-web';
import { AuthApi } from '../service/auth-api';
import { AuthLocalStorage } from '../service/auth-local-storage';


export function playerFactory() {
  return player;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    LottieComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login{
  loginForm: FormGroup;
  options: any; 

  constructor(private fb: FormBuilder ,
    private authService :AuthApi ,
    private authStorageService :AuthLocalStorage) 
    {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.options = {
      path: './Digital Marketing.json', 
      loop: true,
      autoplay: true
    };
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Logging in with:', email, password);
      this.authService.login(this.loginForm.value).subscribe({
        next : (res)=>{
          console.log(res);
          this.authStorageService.setItem('xtost',res);
        } ,
        error :(err)=>{
          console.log(err);
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithGoogle(): void {
    console.log('Google login clicked');
  }

  loginWithMicrosoft(): void {
    console.log('Microsoft login clicked');
  }
}
