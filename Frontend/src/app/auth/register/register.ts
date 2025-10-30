
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
import { AuthLocalStorage } from '../service/auth-local-storage';
import { AuthApi } from '../service/auth-api';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    LottieComponent ,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private dataPrivacy: AuthLocalStorage,
    private authService: AuthApi,
    private router: Router ,
    private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  options = {
    path: './Welcome.json',
    loop: true,
    autoplay: true
  };

  onRegister() {
  if (this.registerForm.valid) {
    console.log('Register form:', this.registerForm.value);

    const userData = this.registerForm.value;
    const plainUser = JSON.parse(JSON.stringify(userData));
    this.dataPrivacy.setItem('pU', plainUser);

    this.authService.sendOtp(userData.email).subscribe({
      next: (response) => {
        console.log('OTP sent successfully:', response);
        this.router.navigate(['/verify']);
      },
      error: (error) => {
        console.error('Error while sending OTP:', error);

        if (error.status === 409) {
          this.snackBar.open('Email already exists. Please login or use another email.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        } else {
          this.snackBar.open('Invalid data. Please check your inputs and try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      },
    });
  } else {
    this.snackBar.open('Please fill out all required fields correctly.', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}


  loginWithGoogle() {
    console.log('Google signup clicked');
  }

  loginWithMicrosoft() {
    console.log('Microsoft signup clicked');
  }
}
