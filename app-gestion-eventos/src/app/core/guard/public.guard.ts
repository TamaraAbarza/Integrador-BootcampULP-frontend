import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    router.navigate(['/home']); // Redirigir al home
    return false;
  } else {
    return true; // Permitir acceso si no hay un token válido
  }
};
