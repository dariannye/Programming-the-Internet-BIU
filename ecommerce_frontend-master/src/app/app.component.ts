import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';  // Importar HomeComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],  // Asegúrate de que HomeComponent esté incluido aquí
  templateUrl: './app.component.html',  // Usar app.component.html
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mi aplicación Angular';
}
