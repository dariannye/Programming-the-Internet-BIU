import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { LoginComponent } from '../login/login.component'; 
import { AuthService } from '../services/auth.service';
import {ChatbotComponent} from '../chatbot/chatbot.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductListComponent, LoginComponent, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isUserLoggedIn = false; 
  products: any[] = [];
  filteredProducts: any[] = [];
  showForm = false;
  selectedProduct: any = null;
  

  constructor(private productService: ProductService, private authService: AuthService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadProducts(); // Cargar los productos al inicio
  }
  checkLoginStatus() {
    this.isUserLoggedIn = this.authService.isAuthenticated(); 
  }


  // Método para cargar los productos desde el backend
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...this.products]; 
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedProduct = null;
  }

  // Método para agregar o actualizar un producto
 /*addOrUpdateProduct(product: any) {
      console.log('Llamando a addOrUpdateProduct con:', product);
    
      if (this.selectedProduct) {
        // Si se seleccionó un producto, solo pasa al formulario para actualizar
        this.selectedProduct = product; // Este producto se pasa a ProductFormComponent
      } else {
        // Crear un nuevo producto desde Home
        this.productService.addProduct(product).subscribe((newProduct) => {
          this.products.push(newProduct);
          this.filteredProducts = [...this.products];
        });
      }
      this.showForm = false;
  }*/
 /* addOrUpdateProduct(product: any) {
    console.log('Llamando a addOrUpdateProduct con:', product);
    
    if (this.selectedProduct) {
      // Actualizar producto en la lista local (sin llamar al servicio)
      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index !== -1) {
        this.products[index] = product;
      }
      this.filteredProducts = [...this.products]; // Actualiza la lista filtrada
    } else {
      // Crear un nuevo producto directamente en la lista local
      this.products.push(product);
      this.filteredProducts = [...this.products]; // Actualiza la lista filtrada
    }
    this.showForm = false;
    this.cdr.detectChanges(); 
  }*/
  addOrUpdateProduct(product: any) {
    if (this.selectedProduct) {
      // Actualizar producto
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products[index] = product;
      }
    } else {
      // Agregar producto
      this.products.push(product);
    }

    // Actualizar la lista filtrada
    this.filteredProducts = [...this.products];
    this.showForm = false; // Cerrar el formulario después de agregar o actualizar
  }
  

  // Método para editar un producto
  editProduct(product: any) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  // Método para eliminar un producto
  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId.toString()).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
      this.filteredProducts = [...this.products];
    });
  }
  


  // Método para buscar productos
  searchProduct(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.nombre.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query)
    );
  }

  logout() {
    this.authService.logout(); 
  }
}

