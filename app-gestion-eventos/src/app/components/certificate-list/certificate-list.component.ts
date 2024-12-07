import { Component, OnInit } from '@angular/core';
import { ParticipationService } from '../../core/services/participation.service'; 
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../core/services/certificate.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { PageEvent } from '@angular/material/paginator'; 
import {MatPaginatorModule} from '@angular/material/paginator';


@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, NavBarComponent, FooterComponent,
    MatPaginatorModule
  ],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css',
})
export class CertificateListComponent implements OnInit {
  certificadosList: any[] = [];

  paginatedCertificates: any[] = [];
  pageSize: number = 3; 
  currentPage: number = 0;

  constructor(
    private _participationService: ParticipationService,
    public _authService: AuthService,
    private _certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    this.cargarCertificados();
  }

  // Cargar certificados
  cargarCertificados(): void {
    this._participationService.getParticipations().subscribe({
      next: (participaciones) => {
        // Filtrar confirmadas
        this.certificadosList = participaciones.filter(
          (participacion) => participacion.isConfirmed == 1
        );
        this.updatePaginatedCertificates();
      },
      error: (err) => {
        console.error('Error al cargar los certificados:', err);
      },
    });
  }

  // generar certificado PDF
  generarCertificado(id: number): void {
    this._certificateService.generarCertificado(id).subscribe({
      next: (certificado) => {
        this._certificateService.crearCertificadoPDF(certificado);
      },
      error: (err) => {
        console.error('Error al obtener el certificado:', err);
      },
    });
  }

   // Actualizar los certificados paginados
   updatePaginatedCertificates(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCertificates = this.certificadosList.slice(startIndex, endIndex);
  }

  // Manejar el cambio de página
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedCertificates();
  }

}
