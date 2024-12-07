import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthService } from '../../core/services/auth.service'; 
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogoService } from '../../core/services/dialogo.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SpinnerComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _dialogService: DialogoService
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(100)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );
  }

  get username() {
    return this.registerForm.get('username');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  enviar() {
    if (this.registerForm.valid) {

      this.loading = true;
      const user = {
        username: this.username?.value,
        email: this.email?.value,
        password: this.password?.value,
        role: 0,
      };

      this._authService.register(user).subscribe({
        next: () => {
          this._dialogService.openDialog(
            'success',
            '¡Usuario registrado con éxito! Ahora puedes iniciar sesión.'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this._dialogService.openDialog(
            'error',
            err?.error?.message || 'Ocurrió un error al registrar el usuario.'
          );
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(field: string) {
    if (field === 'email') {
      if (this.email?.hasError('required')) {
        return 'El correo electrónico es obligatorio.';
      } else if (this.email?.hasError('email')) {
        return 'El formato del correo no es válido.';
      } else if (this.email?.hasError('maxlength')) {
        return 'El correo electrónico no puede tener más de 100 caracteres.';
      }
    } else if (field === 'password') {
      if (this.password?.hasError('required')) {
        return 'La contraseña es obligatoria.';
      } else if (this.password?.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      } else if (this.password?.hasError('maxlength')) {
        return 'La contraseña no puede tener más de 20 caracteres.';
      }
    } else if (field === 'username') {
      if (this.username?.hasError('required')) {
        return 'El nombre completo es obligatorio.';
      } else if (this.username?.hasError('minlength')) {
        return 'El nombre completo debe tener al menos 3 caracteres.';
      } else if (this.username?.hasError('maxlength')) {
        return 'El nombre completo no puede tener más de 50 caracteres.';
      }
    } else if (field === 'confirmPassword') {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  // Validador personalizado para las contraseñas
  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Validar que el nombre solo contenga letras y espacios
  validateInput(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.charCode); // caracter ingresado

    if (!regex.test(inputChar)) {
      event.preventDefault(); // Evita que se ingrese el caracter no válido
    }
  }
}
