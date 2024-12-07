import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Participation } from '../interfaces/participation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:3000/api/participations';
  }

  //metodos para usuario

  getParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/`);
  }

  create(participation: Participation): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, participation);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProximas(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/proximas`);
  }
 
  // METODOS PARA ADMIN

  getAllParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/all`);
  }

  getParticipationsByEvents(id: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/events/${id}`);
  }

  confirm(id: number, isConfirmed: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/confirm/${id}`, { isConfirmed });
  }

  //CERTIFICADO

  // Obtener una participacion por ID para generar certificado
  getCertificate(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificate/${id}`);
  }


}


