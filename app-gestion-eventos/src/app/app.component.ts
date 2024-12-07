import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Para la localización
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registra la localización en español
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }  // Configura la localización globalmente
  ]
})
export class AppComponent {
  title = 'app_gestion_eventos';
}


/*
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { addTokenInterceptor } from './interceptors/add-token.interceptor';  // Ruta de tu interceptor
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule],  // Asegúrate de importar HttpClientModule para las solicitudes HTTP
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: addTokenInterceptor,  // Configurar el interceptor aquí
      multi: true
    }
  ],
  template: `<h1>Mi aplicación Angular Standalone</h1>`
})
*/