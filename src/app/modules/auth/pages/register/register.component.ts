import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  ConfirmPasswordErrorStateMatcher,
  passwordMatchValidator,
} from '../../../../shared/validators/password-match.validator';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  loading = false;
  confirmMatcher = new ConfirmPasswordErrorStateMatcher();

  form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  get name() {
    return this.form.controls.name;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.loading = true;
    this.authService.register({ name, email, password }).subscribe({
      next: (response) => {
        this.notification.success(`Cuenta creada. ¡Bienvenido, ${response.user.name}!`);
        this.router.navigateByUrl('/products');
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.notification.httpError(error);
      },
    });
  }
}