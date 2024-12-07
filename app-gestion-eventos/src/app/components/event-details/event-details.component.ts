import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule, registerLocaleData } from '@angular/common';
import { EventService } from '../../core/services/event.service';
import { Evento } from '../../core/interfaces/evento'; 
import { AuthService } from '../../core/services/auth.service'; 
import { MatIconModule } from '@angular/material/icon';

//fecha
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');
import { LOCALE_ID } from '@angular/core'; 
import { ParticipationService } from '../../core/services/participation.service'; 
import { DialogoService } from '../../core/services/dialogo.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    MatDialogTitle, MatDialogContent,MatDialogActions,
    MatDialogClose,MatIconModule, MatButtonModule,
    CommonModule,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})

export class EventDetailsComponent {

  number: number;
  evento: Evento | null = null;

  // Inyectar MAT_DIALOG_DATA en el constructor para recibir los datos
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _eventService: EventService,
    public _authService: AuthService,
    public _participationService: ParticipationService,
    private _dialogoService : DialogoService
  ) {
    this.number = data; // Asigna el número recibido a la propiedad number
  }

  ngOnInit(): void {
    this.cargarEvento();
  }

  cargarEvento(): void {
    this._eventService.getEvent(this.number).subscribe({
      next: (evento) => {
        this.evento = evento; 
      },
      error: (err) => {
        console.error('Error al obtener el evento:', err);
  
        // Manejo del error
        if (err?.error?.message) {
          this._dialogoService.openDialog('error', err.error.message);
        } else {
          this._dialogoService.openDialog('error', 'Error al obtener el evento');
        }
      },
    });
  }
  
}