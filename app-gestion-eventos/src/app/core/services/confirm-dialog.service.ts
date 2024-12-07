import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(component: any, data: any = {}, enterAnimationDuration: string = '250ms', exitAnimationDuration: string = '200ms') {
    const dialogRef = this.dialog.open(component, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data, // Enviamos los datos al componente del diálogo
    });

    return dialogRef.afterClosed(); // Devuelve un Observable para saber cuándo se cierra el diálogo
  }
}
