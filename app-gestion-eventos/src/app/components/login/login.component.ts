import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormControl,FormsModule,ReactiveFormsModule,Validators,
  FormBuilder, FormGroup} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/interfaces/user'; 
import { DialogoService } from '../../core/services/dialogo.service';
import { SendMailComponent } from '../send-mail/send-mail.component';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})


export class LoginComponent{
 
  loginForm: FormGroup;
  emailErrorMessage = '';
  passwordErrorMessage = '';
  hidePassword = true;
  loading = false; // Variable para controlar el estado de carga

  
  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,private _authService: AuthService,
    private router: Router, private _dialogService: DialogoService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
    });

    this.loginForm
      .get('email')
      ?.statusChanges.pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
    this.loginForm
      .get('password')
      ?.statusChanges.pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }

  // mensaje de error para el email
  updateEmailErrorMessage() {
    const email = this.loginForm.get('email');
    if (email?.hasError('required')) {
      this.emailErrorMessage =
        'Debes introducir una dirección de correo electrónico';
    } else if (email?.hasError('email')) {
      this.emailErrorMessage = 'El email ingresado no es válido';
    } else {
      this.emailErrorMessage = '';
    }
  }

  // mensaje de error para la password
  updatePasswordErrorMessage() {
    const password = this.loginForm.get('password');
    if (password?.hasError('required')) {
      this.passwordErrorMessage = 'La contraseña es requerida';
    } else {
      this.passwordErrorMessage = '';
    }
  }

  // para cambiar ocultar y mostrar password
  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
    event.preventDefault();
  }

  // enviar form
  onSubmit() {

    if (this.loginForm.valid) {

      this.loading = true; 

      const user: User = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        role: 0,
      };
      this._authService.login(user).subscribe({
        next: (token) => {
          localStorage.setItem('token', token); // Guardar el token
          this._authService.cargarUsuario(); // Cargar el usuario
          this.router.navigate(['/home']); // Redirir al home
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al iniciar sesión:', err);

          // Verificar si hay un mensaje de error en el backend
          if (err?.error?.message) {
            this._dialogService.openDialog('error', err.error.message);
            this.loading = false;
          } else {
            this._dialogService.openDialog('error', 'Error al iniciar sesión. Verifica tus credenciales.');
            this.loading = false;
          }
        },
        complete: () => {
          this.loading = false;
          console.log('Petición completada');
        }
      });
    } else {
      this._dialogService.openDialog(
        'error',
        '¡Error al inciar sesión! Asegúrate de que todos los campos sean correctos.'
      );
      this.loading = false;
      console.log('Formulario inválido');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(SendMailComponent, {
      //data: { eventId: eventId }, // pasar el id del evento
    });
  }


}