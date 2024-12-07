import { Component, inject} from '@angular/core';
import { ParticipationService } from '../../core/services/participation.service'; 
import { AuthService } from '../../core/services/auth.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// dialogo
import { DialogoService } from '../../core/services/dialogo.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/footer/footer.component"; 
import {MatPaginatorModule} from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [
    CommonModule,NavBarComponent,FooterComponent,
    FormsModule,CommonModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatCardModule,MatPaginatorModule,
],
  templateUrl: './participations.component.html',
  styleUrl: './participations.component.css',
})

export class ParticipationsComponent {
  participacionList: any[] = [];
  filtroSeleccionado: string = 'proximas'; // Valor inicial 'proximas'
  noHayEventosProximos: boolean = false; // Flag para saber si no hay eventos próximos

  //paginacion
  paginatedParticipation: any[] = [];
  pageSize: number = 6;
  currentPage: number = 0;

  readonly dialog = inject(MatDialog);

  constructor(
    private _participacionService: ParticipationService,
    public _authService: AuthService,
    private _confirmDialogService: ConfirmDialogService,
    private _dialogService: DialogoService,
  ) {}

  ngOnInit(): void {
    this.cargarProximas();
  }

  // manejar el cambio en el select
  onFiltroChange(event: MatSelectChange): void {
    this.filtroSeleccionado = event.value;
  
    // Limpiar la lista antes de cargar nuevos datos
    this.participacionList = [];
    this.paginatedParticipation = [];
  
    if (this.filtroSeleccionado === 'proximas') {
      this.cargarProximas();
    } else {
      this.cargarParticipaciones();
    }
  }
  
  cargarProximas(): void {
    this._participacionService.getProximas().subscribe({
      next: (participaciones) => {
        this.participacionList = participaciones;
        this.noHayEventosProximos = participaciones.length === 0;  // Flag correcto
        this.updatePaginatedParticipation();  // Actualizar la paginación
      },
      error: (err) => {
        console.error('Error al cargar las inscripciones:', err);
        this.participacionList = []; // Limpiar lista en caso de error
        this.noHayEventosProximos = true; 
        this.updatePaginatedParticipation();
      },
    });
  }
  
  cargarParticipaciones(): void {
    this._participacionService.getParticipations().subscribe({
      next: (participaciones) => {
        this.participacionList = participaciones;
        this.noHayEventosProximos = false;
        this.updatePaginatedParticipation();
      },
      error: (err) => {
        console.error('Error al cargar las inscripciones:', err);
      },
    });
  }

  borrarParticipacion(id: number): void {
    this._confirmDialogService
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas cancelar la participación?',
      })
      .subscribe((result) => {
        if (result) {
          this._participacionService.delete(id).subscribe({
            next: () => {
              this.participacionList = this.participacionList.filter(
                (inscripcion) => inscripcion.idParticipacion !== id
              );
              console.log('Participación borrada correctamente');

              if (this.filtroSeleccionado === 'proximas') {
                this.cargarProximas();
              } else {
                this.cargarParticipaciones();
              }
            },
            error: (err) => {
              console.error('Error al borrar la participación:', err);
              this._dialogService.openDialog(
                'error',
                'Error al borrar la participación'
              );
            },
          });
        } else {
          console.log('Operación cancelada');
        }
      });
  }

  verEventoDetalle(id: number) {
    const numberToSend = id;
    this.dialog.open(EventDetailsComponent, {
      data: numberToSend, // pasar el id al dialogo
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedParticipation();
  }

  private updatePaginatedParticipation(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedParticipation = this.participacionList.slice(startIndex, endIndex);
  }

}
