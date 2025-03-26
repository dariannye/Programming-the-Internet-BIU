import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class ProductService {
  private apiUrl = '/api/productos';  

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Agregar un producto
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, product);
  }

  // Actualizar un producto
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
