import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Evento } from '../../core/interfaces/evento'; 
import { EventService } from '../../core/services/event.service'; 
import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/user'; 
import { AuthService } from '../../core/services/auth.service';
import { ParticipationService } from '../../core/services/participation.service'; 

// dialogo
import { DialogoService } from '../../core/services/dialogo.service'; 
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service'; 
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventDetailsComponent } from '../event-details/event-details.component';

//select
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { EventFormComponent } from '../event-form/event-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatChipsModule,
    MatPaginatorModule,
],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {
  listEvents: Evento[] = [];
  selectedFilter: string = 'proximos';
  user: User | null = null;
  //paginacion
  paginatedEvents: Evento[] = [];
  pageSize: number = 5;
  currentPage: number = 0;

  readonly dialog = inject(MatDialog);

  constructor(
    private _eventService: EventService,
    public _authService: AuthService,
    public _participationService: ParticipationService,
    private _confirmDialogService: ConfirmDialogService,
    private _dialogService: DialogoService
  ) {}

  ngOnInit(): void {
    this.getProximos();
  }

  getEvents() {
    this._eventService.getAllEvents().subscribe((data) => {
      this.listEvents = data;
      this.updatePaginatedEvents();
    });
  }

  getProximos() {
    this._eventService.getProximos().subscribe((data) => {
      this.listEvents = data;
      this.updatePaginatedEvents();
    });
  }

  onFiltroChange(event: any): void {
    this.selectedFilter = event.value;

    if (this.selectedFilter === 'todos') {
      this.getEvents();
    } else if (this.selectedFilter === 'proximos') {
      this.getProximos();
    }
  }

  verEventoDetalle(id: number) {
    const numberToSend = id;
    this.dialog.open(EventDetailsComponent, {
      data: numberToSend, // pasar el id al dialogo
    });
  }

  borrarEvento(id: number): void {
    this._confirmDialogService
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas borrar este evento?',
      })
      .subscribe((result) => {
        if (result) {
          this._eventService.deleteEvent(id).subscribe({
            next: () => {
              this.listEvents = this.listEvents.filter(
                (evento) => evento.id !== id
              );
              console.log('Evento borrado correctamente');
              this._dialogService.openDialog(
                'success',
                'Evento borrado correctamente'
              );
              // Actualizar la lista después de borrar el evento
              this.actualizarEventos();
            },
            error: (err) => {
              console.error('Error al borrar el evento:', err);
              this._dialogService.openDialog(
                'error',
                'Error al borrar el evento'
              );
            },
          });
        }
      });
  }

  // Participar en un evento
  participar(idEvento: number): void {

     //usuario actual
     this._authService.getCurrentUser$().subscribe((user) => {
      this.user = user || null;
    });

    const nuevaParticipacion = {
      userId: this.user?.id || 0,
      eventId: idEvento,
      isConfirmed: 0,
    };

    this._participationService.create(nuevaParticipacion).subscribe({
      next: () => {
        this._dialogService.openDialog(
          'success',
          '¡Te has inscrito al evento con éxito!'
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
        console.error('Error al inscribirse al evento:', err);
      },
    });
  }

  openDialog(eventId: number): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      data: { eventId: eventId }, // pasar el id del evento
    });

    // Después de que el diálogo se cierra, actualiza la lista de eventos
    dialogRef.afterClosed().subscribe(() => {
      this.actualizarEventos();
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedEvents();
  }

  private actualizarEventos(): void {
    // Actualiza la lista de eventos según el filtro actual
    if (this.selectedFilter === 'todos') {
      this.getEvents();
    } else if (this.selectedFilter === 'proximos') {
      this.getProximos();
    }
  }

  private updatePaginatedEvents(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEvents = this.listEvents.slice(startIndex, endIndex);
  }
}
