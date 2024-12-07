import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialogo',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogActions,MatDialogContent,MatButtonModule,],
  templateUrl: './dialogo.component.html',
  styleUrl: './dialogo.component.css',
})
export class DialogoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { type: 'success' | 'error'; message: string }
  ) {}

  getTitle(): string {
    return this.data.type === 'success' ? 'Operación Exitosa' : 'Error';
  }

  getBackgroundColor(): string {
    return this.data.type === 'success' ? '#28a745' : '#dc3545'; // Verde éxito, rojo error
  }

  getIcon(): string {
    return this.data.type === 'success'
      ? 'bi-check-circle-fill' // Icono de éxito
      : 'bi-exclamation-triangle-fill'; // Icono de error
  }
}