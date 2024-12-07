import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,MatButtonModule,MatIconModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  resetForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  token: string = '';
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );

    this.token = this.route.snapshot.paramMap.get('token') || '';

    // Validación en tiempo real para los campos
    this.resetForm.valueChanges.subscribe(() => {
      this.resetForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
  }

  // Validador personalizado para contraseñas
  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Enviar formulario
  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const newPassword = this.resetForm.value.newPassword;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.successMessage = 'Contraseña restablecida con éxito. Redirigiendo...';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al restablecer la contraseña.';
        this.successMessage = '';
        console.error(err);
      },
    });
  }

  // Toggle para mostrar/ocultar contraseña
  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  // Obtener mensaje de error
  getErrorMessage(field: string) {
    if (field === 'newPassword') {
      if (this.resetForm.get('newPassword')?.hasError('required')) {
        return 'La contraseña es obligatoria.';
      } else if (this.resetForm.get('newPassword')?.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
    }
    return '';
  }
}