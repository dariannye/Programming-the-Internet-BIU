import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() products: any[] = [];
  @Output() editProduct = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<number>();

  edit(product: any) {
    this.editProduct.emit(product);
  }

  delete(productId: number) {
    this.deleteProduct.emit(productId);
  }
}

