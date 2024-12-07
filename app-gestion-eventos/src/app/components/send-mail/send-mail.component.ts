import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'; 
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { interval } from 'rxjs'; // Para el contador de tiempo

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.css',
})
export class SendMailComponent {
  resetForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  countdown: number = 60; // Tiempo de cuenta regresiva en segundos
  countdownSubscription: any; // Para la suscripción al contador
  isCountdownActive: boolean = false; // Para saber si el contador está activo

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SendMailComponent>
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const email = this.resetForm.value.email;
    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.successMessage =
          'Correo enviado. Por favor, revisa tu bandeja de entrada.';
        this.errorMessage = '';
        this.startCountdown(); // Iniciamos el contador cuando el correo es enviado
      },
      error: (err) => {
        this.errorMessage =
          'Error al solicitar el restablecimiento de contraseña.';
        this.successMessage = '';
        console.error(err);
      },
    });
  }

  // Iniciamos el contador de 60 segundos
  startCountdown() {
    this.isCountdownActive = true;
    this.countdownSubscription = interval(1000).subscribe((sec) => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.countdownSubscription.unsubscribe(); // Detenemos el contador cuando llegue a 0
        this.isCountdownActive = false;
      }
    });
  }

  //cerrar dialogo
  onCancel() {
    this.dialogRef.close();
  }
}
