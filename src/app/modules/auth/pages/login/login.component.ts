import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hidePassword = true;
  loading = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.notification.success(`¡Hola, ${response.user.name}!`);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.notification.httpError(error);
      },
    });
  }
}