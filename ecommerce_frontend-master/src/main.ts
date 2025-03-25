import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), 
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
      { path: 'home', loadComponent: () => import('./app/home/home.component').then(m => m.HomeComponent) },
    ])
  ]
}).catch(err => console.error(err));


