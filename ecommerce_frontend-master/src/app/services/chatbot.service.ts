import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = '/api/chatbot/obtener_respuesta'; // Se usa el proxy

  constructor(private http: HttpClient) {}

  obtenerRespuesta(mensaje: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ mensaje: mensaje });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}

