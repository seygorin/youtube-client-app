import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validationService = inject(ValidationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = '';
  isSubmitting = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.validationService.passwordStrengthValidator,
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const result = this.authService.login(this.loginForm.value);

    if (result.success) {
      const returnUrl =
        this.route.snapshot.queryParams['returnUrl'] || '/admin';
      void this.router.navigateByUrl(returnUrl);
    } else {
      this.errorMessage = result.message || 'Login failed';
      this.isSubmitting = false;
    }
  }

  getEmailErrorMessage(): string {
    return this.validationService.getEmailErrorMessage(
      this.loginForm.get('email')!
    );
  }

  getPasswordErrorMessage(): string {
    return this.validationService.getPasswordErrorMessage(
      this.loginForm.get('password')!
    );
  }
}
