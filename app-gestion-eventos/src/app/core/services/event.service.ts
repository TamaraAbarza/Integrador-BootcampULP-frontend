import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = 'http://localhost:3000/api/events';
  }

  getAllEvents(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/`);
  }

  getProximos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/proximos`);
  }

  // Obtener un evento por ID
  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Métodos para ADMIN ------------------------------------------------------

  createEvent(evento: Evento): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, evento);
  }

  updateEvent(id: number, evento: Evento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
