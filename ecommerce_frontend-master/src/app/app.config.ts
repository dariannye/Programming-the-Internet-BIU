import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importa provideAnimations
import { provideHttpClient } from '@angular/common/http'; // Importa provideHttpClient
import { routes } from './app.routes';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    
  ]
};