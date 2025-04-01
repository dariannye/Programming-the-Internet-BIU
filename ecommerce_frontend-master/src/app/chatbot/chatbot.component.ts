/*import { Component } from '@angular/core';
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
  
}*/
import { Component, OnInit } from '@angular/core';
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
export class ChatbotComponent implements OnInit {
  mensajeUsuario: string = '';
  mensajes: { texto: string, deUsuario: boolean }[] = [];
  productos: any[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.chatbotService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos obtenidos:', this.productos);
      },
      error: () => {
        console.error('Error al obtener productos');
      }
    });
  }

  enviarMensaje(): void {
    if (!this.mensajeUsuario.trim()) return;

    this.mensajes.push({ texto: this.mensajeUsuario, deUsuario: true });
    const mensaje = this.mensajeUsuario;
    this.mensajeUsuario = '';

    // Verifica si el mensaje contiene alguna consulta sobre productos
    if (mensaje.toLowerCase().includes("cuánto cuesta el producto")) {
      const producto = this.extraerNombreProducto(mensaje);
      this.chatbotService.obtenerProductoPorNombre(producto).subscribe({
        next: (producto) => {
          this.mensajes.push({
            texto: `El precio de ${producto.nombre} es $${producto.precio}.`,
            deUsuario: false
          });
        },
        error: () => {
          this.mensajes.push({
            texto: `Lo siento, no pude encontrar información sobre ${producto}.`,
            deUsuario: false
          });
        }
      });
    } else if (mensaje.toLowerCase().includes("de qué categoría es el producto")) {
      const producto = this.extraerNombreProducto(mensaje);
      this.chatbotService.obtenerProductoPorNombre(producto).subscribe({
        next: (producto) => {
          this.mensajes.push({
            texto: `${producto.nombre} pertenece a la categoría ${producto.categoria}.`,
            deUsuario: false
          });
        },
        error: () => {
          this.mensajes.push({
            texto: `Lo siento, no pude encontrar la categoría de ${producto}.`,
            deUsuario: false
          });
        }
      });
    } else if (mensaje.toLowerCase().includes("cuáles productos hay disponibles")) {
      this.chatbotService.obtenerProductos().subscribe({
        next: (productos) => {
          const nombresProductos = productos.map((p: { nombre: any; }) => p.nombre).join(', ');
          this.mensajes.push({
            texto: `Los productos disponibles son: ${nombresProductos}.`,
            deUsuario: false
          });
        },
        error: () => {
          this.mensajes.push({
            texto: 'Lo siento, no pude obtener la lista de productos.',
            deUsuario: false
          });
        }
      });
    } else if (mensaje.toLowerCase().includes("cuánto hay en stock del producto")) {
      const producto = this.extraerNombreProducto(mensaje);
      this.chatbotService.obtenerProductoPorNombre(producto).subscribe({
        next: (producto) => {
          this.mensajes.push({
            texto: `Hay ${producto.stock} unidades de ${producto.nombre} en stock.`,
            deUsuario: false
          });
        },
        error: () => {
          this.mensajes.push({
            texto: `Lo siento, no pude obtener la información de stock de ${producto}.`,
            deUsuario: false
          });
        }
      });
    }  else if (mensaje.includes("productos en la categoría") || mensaje.includes("productos de la categoría")) {
      const categoria = this.extraerCategoria(mensaje);
      this.chatbotService.obtenerProductosPorCategoria(categoria).subscribe({
        next: (productos) => {
          if (productos.length > 0) {
            const nombresProductos = productos.map((p: { nombre: any; }) => p.nombre).join(', ');
            this.mensajes.push({
              texto: `Los productos en la categoría ${categoria} son: ${nombresProductos}.`,
              deUsuario: false
            });
          } else {
            this.mensajes.push({
              texto: `No hay productos en la categoría ${categoria}.`,
              deUsuario: false
            });
          }
        },
        error: () => {
          this.mensajes.push({
            texto: `Lo siento, no pude obtener los productos de la categoría ${categoria}.`,
            deUsuario: false
          });
        }
      });
    }else {
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

 // Método para extraer el nombre del producto de la pregunta
/*extraerNombreProducto(mensaje: string): string {
  // Usamos una expresión regular más flexible para capturar el nombre del producto
  const regex = /\b(el|la|los|las)\s([a-zA-Z0-9áéíóúÁÉÍÓÚüÜ]+)\b/;
  const matches = mensaje.match(regex);
  return matches && matches[2] ? matches[2].trim() : '';
}*/
extraerNombreProducto(mensaje: string): string {
  // Expresión regular mejorada para capturar nombres de productos con múltiples palabras
  const regex = /(cuánto cuesta|de qué categoría es|cuánto hay en stock del|stock de|disponible de|queda de)\s+(el|la|los|las)?\s*([\w\sáéíóúÁÉÍÓÚüÜ-]+)/i;
  const matches = mensaje.match(regex);
  return matches && matches[3] ? matches[3].trim() : '';
}
extraerCategoria(mensaje: string): string {
  const regex = /categoría\s+([a-zA-Z0-9áéíóúÁÉÍÓÚüÜ]+)/;
  const matches = mensaje.match(regex);
  return matches && matches[1] ? matches[1].trim() : '';
}



}
