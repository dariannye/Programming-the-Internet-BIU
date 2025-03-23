import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './app/services/product.service';

// Arrancar la aplicación con el componente standalone
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ProductService,
  ],
}).catch(err => console.error(err));

