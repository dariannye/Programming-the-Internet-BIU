import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';
  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, ingresa tus credenciales';
      return;
    }

    this.authService.login(this.credentials.email, this.credentials.password)
    .subscribe({
      next: (response) => {
        if (response.status === 200 && response.token) {
          localStorage.setItem('currentUser', JSON.stringify({ token: response.token, email: this.credentials.email }));
          this.router.navigate(['/home']);  // Redirigir al home (o cualquier otra ruta protegida)
        } else {
          // Mostrar el error en pantalla
          this.errorMessage = response.error || 'Credenciales incorrectas!!!!';
        }
      },
      error: (error) => {
        console.error('Error de autenticación', error);
        this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Intenta nuevamente más tarde.';
      }
    });
  }
  
}




