import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class CartService {
    private apiUrl = '/api/cart/add';
    private cart: any[] = [];
  
    constructor(private http: HttpClient) {}
  
    /*addToCart(productId: number, quantity: number): Observable<any> {
      return this.http.post<any>(this.apiUrl, { productId, quantity });
    }*/
      addToCart(productId: number, quantity: number): Observable<any> {
        return this.http.post<any>(this.apiUrl, { productId, quantity }).pipe(
            tap(response => {
                const existingProductIndex = this.cart.findIndex(p => p.id === response.product.id);
                if (existingProductIndex === -1) {
                    // Aseguramos que el precio y la cantidad sean números
                    this.cart.push({ ...response.product, cantidad: quantity, precio: parseFloat(response.product.precio) });
                } else {
                    this.cart[existingProductIndex].cantidad += quantity;
                }
            })
        );
    }
    
    
    
      

    updateCart(product: any) {
        const itemIndex = this.cart.findIndex(p => p.id === product.id);
        if (itemIndex !== -1) {
            this.cart[itemIndex].cantidad = product.cantidad; 
        } else {
            this.cart.push({ ...product, cantidad: product.cantidad });
        }
    }
    
    
    
    
      
  
    getCart() {
      return this.cart;
    }
    getTotal(): number {
        // Recorremos el carrito y sumamos el precio * cantidad de cada producto
        return this.cart.reduce((total, product) => {
          const productPrice = parseFloat(product.precio); // Aseguramos que el precio es numérico
          const productQuantity = product.cantidad; // Verificamos la cantidad
          const totalF = total + (productPrice * productQuantity);
         console.log('Este es el total: ', totalF);
          return totalF;
        }, 0); // Empezamos desde 0
      }
      
    

    getUpdatedCart(): Observable<any[]> {
        return new Observable<any[]>(observer => {
          observer.next(this.cart);
        });
    }
   
      
  }
  