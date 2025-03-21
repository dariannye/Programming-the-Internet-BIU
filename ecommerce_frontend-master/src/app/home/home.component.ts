import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component'; 
import { ProductListComponent } from '../product-list/product-list.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: any[] = [];
  filteredProducts: any[] = [];
  showForm = false;
  selectedProduct: any = null;

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedProduct = null; 
  }

  addOrUpdateProduct(product: any) {
    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index !== -1) this.products[index] = product;
    } else {
      product.id = Date.now();
      this.products.push(product);
    }
    this.filteredProducts = [...this.products];
    this.showForm = false;
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  deleteProduct(productId: number) {
    this.products = this.products.filter(p => p.id !== productId);
    this.filteredProducts = [...this.products];
  }

  searchProduct(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
  }
}
