import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

//para usar el modulo http:
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(routes), // Configuración de rutas
    provideClientHydration(),
    provideHttpClient(
      withFetch(), // Para usar Fetch API
      withInterceptors([authInterceptor]) // Registro del interceptor
    ),
    provideAnimationsAsync(),
  ],
};