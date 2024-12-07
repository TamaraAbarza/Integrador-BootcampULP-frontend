import { Component } from '@angular/core';
import { ParticipationService } from '../../core/services/participation.service'; 
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// dialogo
import { DialogoService } from '../../core/services/dialogo.service'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Evento } from '../../core/interfaces/evento';
import { EventService } from '../../core/services/event.service'; 


@Component({
  selector: 'app-participations-admin',
  standalone: true,
  imports: [
    CommonModule,FormsModule,NavBarComponent,FooterComponent,
    MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatPaginatorModule, MatChipsModule,MatSelectModule,MatFormFieldModule,
  ],
  templateUrl: './participations-admin.component.html',
  styleUrl: './participations-admin.component.css',
})
export class ParticipationsAdminComponent {
  participacionList: any[] = [];
  filteredList: any[] = []; 
  filtroConfirmacion: string = 'todos'; 
  filtroFecha: string = 'todas'; 
  filtroEvento: string = 'todos';

  paginatedList: any[] = []; 
  pageSize = 5; 
  pageIndex = 0;

  eventList: Evento[] = [];
  
  constructor(
    private _participacionService: ParticipationService,
    public _authService: AuthService,
    private _dialogService: DialogoService,
    private _eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.cargarParticipaciones();
    this.getEvents() //cargar para select
  }

  cargarParticipaciones(): void {
    this._participacionService.getAllParticipations().subscribe({
      next: (participaciones) => {
        this.participacionList = participaciones;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Error al cargar las inscripciones:', err);
      },
    });
  }

  aplicarFiltro(): void {
    let listaFiltrada = this.participacionList;

    // Filtrar por confirmación
    if (this.filtroConfirmacion !== 'todos') {
      listaFiltrada = listaFiltrada.filter(
        (participacion) =>
          participacion.isConfirmed == (this.filtroConfirmacion === 'confirmadas' ? 1 : 0)
      );
    }

    // Filtrar por fecha
    if (this.filtroFecha !== 'todas') {
      const hoy = new Date();
      if (this.filtroFecha === 'proximas') {
        listaFiltrada = listaFiltrada.filter(
          (participacion) => new Date(participacion.Event?.date) > hoy
        );
      } else if (this.filtroFecha === 'pasadas') {
        listaFiltrada = listaFiltrada.filter(
          (participacion) => new Date(participacion.Event?.date) <= hoy
        );
      }
    }

    // Filtrar por evento
    if (this.filtroEvento !== 'todos') {
      listaFiltrada = listaFiltrada.filter(
        (participacion) => participacion.Event?.id == this.filtroEvento
      );
    }

    this.filteredList = listaFiltrada;
    this.updatePaginatedList();
  }

  // Actualizar la lista de participaciones paginada
  updatePaginatedList() {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedList = this.filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  // Manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  confirmarParticipacion(id: number, isConfirm: number): void {
    this._participacionService.confirm(id, isConfirm).subscribe({
      next: (response) => {
        console.log('Participación confirmada', response);

        this._dialogService.openDialog(
          'success',
          '¡La participación ha sido confirmada correctamente!'
        );

        this.cargarParticipaciones();
      },
      error: (err) => {
        console.error('Error al confirmar la participación', err);
        // Recargo la lista para volver al estado original en caso de error
        this.cargarParticipaciones();

        if (err?.error?.message) {
          this._dialogService.openDialog('error', err.error.message);
        } else {
          if (err.status === 400) {
            this._dialogService.openDialog(
              'error',
              'Error de validación: datos incorrectos.'
            );
          } else if (err.status === 500) {
            this._dialogService.openDialog(
              'error',
              'Ocurrió un error en el servidor. Por favor, inténtalo más tarde.'
            );
          } else {
            this._dialogService.openDialog(
              'error',
              'Ocurrió un error al intentar confirmar la participación. Por favor, inténtalo más tarde.'
            );
          }
        }
      },
    });
  }

  //cargar eventos para select
  getEvents() {
    this._eventService.getAllEvents().subscribe((data) => {
      this.eventList = data;
    });
  }


}
