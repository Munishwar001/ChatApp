
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
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
    LottieComponent
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      // TODO: Send registration data to your backend
    }
  }

  loginWithGoogle() {
    console.log('Google signup clicked');
    // TODO: integrate Google auth (e.g., Firebase Auth or OAuth)
  }

  loginWithMicrosoft() {
    console.log('Microsoft signup clicked');
    // TODO: integrate Microsoft auth (MSAL or OAuth)
  }
}
