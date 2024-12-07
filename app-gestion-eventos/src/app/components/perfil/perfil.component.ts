import { Component, OnInit } from '@angular/core';
import { User } from '../../core/interfaces/user';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogoService } from '../../core/services/dialogo.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    NavBarComponent,
    FooterComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  user: User | null = null; // Usuario actual
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Propiedades para controlar la visibilidad de las contraseñas
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder, 
    private _authService: AuthService,
    private _dialogService: DialogoService,
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }],
      id: [{ value: '', disabled: true }],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtener datos del usuario actual
    this._authService.getCurrentUser$().subscribe((user) => {
      this.user = user;
      if (user) {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          id: user.id,
        });
      }
    });

    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswords();
    });
  }

  validatePasswords(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.passwordForm.get('confirmPassword')?.setErrors(null);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const { username, email } = this.profileForm.value;
      console.log('Perfil actualizado:', this.profileForm.value);
  
      this._authService.updateUser(username, email).subscribe({
        next: (response) => {
          console.log('Perfil actualizado con éxito', response);
          // recargar los datos del usuario
          this._authService.cargarUsuario();
          this._dialogService.openDialog(
            'success',
            '¡Se modificaron correctamente los datos!'
          );
        },
        error: (err) => {
          if (err?.error?.message) {
            this._dialogService.openDialog('error', err.error.message);
          } else {
            this._dialogService.openDialog(
              'error',
              'Error al inscribirse al evento'
            );
          }
          console.error('Error al actualizar el perfil', err);
        }
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      console.log('Contraseña actualizada:', this.passwordForm.value);
  
      this._authService.updatePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          console.log('Contraseña actualizada con éxito', response);
          this._dialogService.openDialog(
            'success',
            '¡Se modificó correctamente la contraseña!'
          );
        },
        error: (err) => {
          if (err?.error?.message) {
            this._dialogService.openDialog('error', err.error.message);
          } else {
            this._dialogService.openDialog(
              'error',
              'Error al modificar la contraseña'
            );
          }
          console.error('Error al actualizar la contraseña', err);
        }
      });
    }
  }


  // Método para alternar la visibilidad
  toggleVisibility(field: string): void {
    if (field === 'current') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else if (field === 'new') {
      this.hideNewPassword = !this.hideNewPassword;
    } else if (field === 'confirm') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  toggleCurrentPassword() {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }

  toggleNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

}
