import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../services/product.service'; // Asegúrate de importar el ProductService
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  showForm = false;
  selectedProduct: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(); // Cargar los productos al inicio
  }

  // Método para cargar los productos desde el backend
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...this.products]; // Inicializar la lista filtrada
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedProduct = null;
  }

  // Método para agregar o actualizar un producto
  addOrUpdateProduct(product: any) {
    if (this.selectedProduct) {
      // Actualizar producto
      this.productService.updateProduct(this.selectedProduct.id, product).subscribe(() => {
        this.loadProducts(); // Recargar los productos después de la actualización
      });
    } else {
      // Crear nuevo producto
      this.productService.addProduct(product).subscribe(() => {
        this.loadProducts(); // Recargar los productos después de agregar
      });
    }
    this.showForm = false;
  }

  // Método para editar un producto
  editProduct(product: any) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  // Método para eliminar un producto
  deleteProduct(productId: number) {
  this.productService.deleteProduct(productId.toString()).subscribe(() => {
    this.loadProducts(); // Recargar los productos después de la eliminación
  });
}


  // Método para buscar productos
  searchProduct(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }
}

