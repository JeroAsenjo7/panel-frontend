import { AbstractControl, FormControl, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export function passwordMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (!password || !confirm) {
      return null;
    }
    return password === confirm ? null : { passwordMismatch: true };
  };
}

export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    const touched = !!control?.touched;
    const invalid = !!control?.invalid;
    const mismatch = !!control?.parent?.hasError('passwordMismatch');
    return touched && (invalid || mismatch);
  }
}