import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = '/api/chatbot/obtener_respuesta'; // Se usa el proxy
  private productosApiUrl = '/api/productos'; // Endpoint para obtener productos
  private productoApiUrl = '/api/productos';

  constructor(private http: HttpClient) {}

  obtenerRespuesta(mensaje: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { mensaje };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  obtenerProductos(): Observable<any> {
    return this.http.get<any>(this.productosApiUrl);
  }

  obtenerProductoPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.productoApiUrl}/showByName/${nombre}`);
  }
  obtenerProductosPorCategoria(categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.productosApiUrl}/showByCategoria/${categoria}`);
  }
  
}


