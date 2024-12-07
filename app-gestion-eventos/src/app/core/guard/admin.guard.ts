import { inject } from '@angular/core';
import { CanActivateFn,  Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
 
  const router = inject(Router);

  const role = localStorage.getItem('role');
    if (role !== '1') {
      // Si no es admin, redirigir al home
      console.log("Acceso no autorizado")
      router.navigate(['/home']);
      return false;
    }

  return true; // Permitir la activación si el token está presente
};
