import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_MESSAGES: Record<string, string> = {
  'Email already taken': 'Ese email ya está registrado',
  'Incorrect email or password': 'Email o contraseña incorrectos',
  'Please authenticate': 'Tu sesión expiró, iniciá sesión de nuevo',
  Forbidden: 'No tenés permisos para realizar esta acción',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
  }

  httpError(error: HttpErrorResponse, fallback = 'Ocurrió un error inesperado'): void {
    if (error.status === 0) {
      this.error('No se pudo conectar con el servidor');
      return;
    }
    const message: string | undefined = error.error?.message;
    this.error((message && BACKEND_MESSAGES[message]) || message || fallback);
  }
}