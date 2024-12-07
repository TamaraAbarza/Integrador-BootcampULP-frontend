import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogoComponent } from '../../shared/dialogo/dialogo.component'; 

@Injectable({
  providedIn: 'root'
})
export class DialogoService {

  constructor(private dialog: MatDialog) {}

  // Método para abrir el diálogo, recibiendo el tipo (success/error) y el mensaje
  openDialog(type: 'success' | 'error', message: string) {
    const dialogRef = this.dialog.open(DialogoComponent, {
      data: {
        type: type,
        message: message,
      },
    });

    return dialogRef;
  }

}
