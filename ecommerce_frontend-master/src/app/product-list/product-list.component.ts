import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() products: any[] = [];
  @Output() editProduct = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<number>();

  constructor(private cartService: CartService) {}

  edit(product: any) {
    this.editProduct.emit(product);
  }

  delete(productId: number) {
    this.deleteProduct.emit(productId);
  }

  addToCart(product: any, quantity: number) {
    if (quantity > 0 && quantity <= product.stock) {
      this.cartService.addToCart(product.id, quantity).subscribe(response => {
        // Actualizar el stock del producto en la lista de productos
        product.stock = response.newStock;
        // Actualizar el carrito en el home.component
        this.cartService.updateCart(response.product); // Llamar al servicio para agregar el producto al carrito
        quantity = 0;
        alert('Producto agregado al carrito');
      });
    } else {
      alert('Cantidad inválida');
    }
  }
}  


