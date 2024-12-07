import { Injectable } from '@angular/core';
import { ParticipationService } from './participation.service';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(
    private _participationService: ParticipationService
  ) {}

  generarCertificado(id: number): Observable<any> {
    return this._participationService.getCertificate(id);
  }

  // Método para generar el PDF del certificado
  crearCertificadoPDF(certificado: any): void {
    const doc = new jsPDF('landscape', 'mm', 'a4'); 

    // Fondo
    doc.setFillColor(245, 245, 245); 
    doc.rect(10, 10, 277, 180, 'F'); 

    // Marco 
    doc.setDrawColor(0, 0, 128); 
    doc.setLineWidth(2); 
    doc.rect(10, 10, 277, 180); 
    doc.setDrawColor(0, 0, 128); 
    doc.setLineWidth(0.5);
    doc.line(12, 12, 287, 12); 
    doc.line(12, 12, 12, 190);
    doc.line(287, 12, 287, 190); 
    doc.line(12, 190, 287, 190);

    // Título del certificado
    doc.setFont('times', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 128);
    doc.text('Certificado de Participación', 148, 50, { align: 'center' });

    // Mensaje central
    doc.setFont('times', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);

    doc.text('Se otorga a', 148, 75, { align: 'center' });
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text(certificado.User.username, 148, 95, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(18);
    doc.text('Por su destacada participación en el evento:', 148, 115, { align: 'center' });
    doc.setFont('times', 'italic');
    doc.setFontSize(20);
    doc.text(certificado.Event?.name , 148, 135, { align: 'center' });

    // Fecha de emisión 
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.text('Fecha de emisión: ' + new Date().toLocaleDateString(), 148, 155, { align: 'center' });

    // Detalles de la empresa al pie
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gris claro
    doc.text('Bootcamp ULP - www.eventos.com', 148, 175, { align: 'center' });

    // Agregar un pequeño logo (si lo tienes, como una imagen)
    // Si tienes un logo en formato base64, puedes agregarlo aquí
    // doc.addImage('logo.png', 'PNG', 15, 15, 40, 40);  // Asegúrate de tener el logo disponible

    this.addDecorativeDetails(doc);

    // Guardar el documento como un archivo PDF
    doc.save(`certificado_${certificado.User.username}_${certificado.Event?.name}.pdf`);
  }

  // Método para agregar detalles
  private addDecorativeDetails(doc: jsPDF) {
    doc.setDrawColor(0, 0, 128); 
    doc.setLineWidth(0.5);
    doc.line(15, 15, 50, 15); 
    doc.line(15, 15, 15, 50); 
    doc.line(237, 15, 272, 15); 
    doc.line(287, 15, 287, 50); 
    doc.line(15, 185, 50, 185); 
    doc.line(15, 185, 15, 150);
    doc.line(237, 185, 272, 185);
    doc.line(287, 185, 287, 150); 
    doc.line(282, 15, 282, 50); 
    doc.line(267, 15, 282, 15); 
    doc.line(282, 185, 282, 150); 
    doc.line(267, 185, 282, 185);
  }

}
