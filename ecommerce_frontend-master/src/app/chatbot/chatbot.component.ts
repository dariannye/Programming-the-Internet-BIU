import { Component } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  mensajeUsuario: string = '';
  mensajes: { texto: string, deUsuario: boolean }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  enviarMensaje(): void {
    if (!this.mensajeUsuario.trim()) return;
  
    this.mensajes.push({ texto: this.mensajeUsuario, deUsuario: true });
    const mensaje = this.mensajeUsuario;
    this.mensajeUsuario = '';
  
    this.chatbotService.obtenerRespuesta(mensaje).subscribe({
      next: (response) => {
        this.mensajes.push({ texto: response.respuesta, deUsuario: false });
      },
      error: () => {
        this.mensajes.push({ texto: 'Error al obtener respuesta.', deUsuario: false });
      }
    });
  }
  
}
