import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private apiUrl: string = 'http://localhost:3000/api/auth';
  private userRole: number = 0;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Observable para el usuario actual
  getCurrentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Método para cargar el usuario actual desde el servidor
  cargarUsuario(): void {
    this.getUser().subscribe({
      next: (user: User) => {
        this.currentUserSubject.next(user);
        this.userRole = user.role;

        // Guardar datos en localStorage
        localStorage.setItem('username', user.username || '');
        localStorage.setItem('role', user.role.toString());
        console.log('Usuario cargado:', user);
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
        this.logout(); // Cerrar sesión si no se puede cargar el usuario
      },
    });
  }

  // Método para verificar si el token es válido
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return payload.exp > currentTime; // Verifica si el token no ha expirado
    } catch (e) {
      return false; // Si ocurre un error al decodificar el token, se considera inválido
    }
  }

  // Método para el registro de un usuario
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Método para iniciar sesión
  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, user).pipe(
      tap((token) => {
        // Guardar token en localStorage
        localStorage.setItem('token', token);

        // Cargar datos del usuario tras el login exitoso
        this.cargarUsuario();
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    this.currentUserSubject.next(null); // Resetea el usuario actual
    this.userRole = 0;

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  getRole(): number {
    return this.userRole;
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') == '1';
  }

  // obtener el usuario logueado
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  //cargar lista de usuarios:
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  //modificar rol:
  updateRole(id: number, role: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/role/${id}`, { role: role });
  }

  //modificar usuario 

  updateUser(username: string, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUser`, { username, email });
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePassword`, { currentPassword, newPassword });
  }
 
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,);
  }

  //_--------------------- para mail de cambio de contraseña

  // Solicitar restablecimiento de contraseña
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
  }

  // Restablecer contraseña
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
    });
  }
}