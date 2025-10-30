
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AuthApi } from '../service/auth-api';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthLocalStorage } from '../service/auth-local-storage';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule, MatSnackBarModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  otp: string = '';

  constructor(private authService: AuthApi,
    private router: Router,
    private snackBar: MatSnackBar,
    private userStorage: AuthLocalStorage) { }

  submitOtp() {
    console.log('Entered OTP = ', this.otp);
    if (this.otp.length !== 6) {
      this.snackBar.open('OTP must be 6 digits long', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    this.verifyOtp();
  }

  verifyOtp() {
    const user = this.userStorage.getItem("pU");
    if (!user) {
      this.snackBar.open('User data not found. Please register again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/register']);
      return;
    } 
     
    const payload = {
      otp: this.otp,
      ...user
    };
    console.log("user data is",payload);

    this.authService.verifyOtpAndRegister(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open('OTP verified successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.snackBar.open('Invalid OTP. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}

