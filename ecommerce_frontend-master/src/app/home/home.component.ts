import { Component } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';  // Importa ProductFormComponent

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductFormComponent],  // Asegúrate de agregar ProductFormComponent en los imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: any[] = [];  // Array para almacenar los productos

  // Método para agregar el producto al listado
  addProduct(product: any) {
    this.products.push(product);  // Agregar producto al array
  }
}

