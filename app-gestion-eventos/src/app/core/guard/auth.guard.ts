import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    return true; // Permitir acceso si el token es válido
  } else {
    router.navigate(['/login']); // Redirigir al login
    return false;
  }
};
