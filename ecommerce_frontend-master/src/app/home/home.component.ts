import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { LoginComponent } from '../login/login.component'; 
import { AuthService } from '../services/auth.service';
import {ChatbotComponent} from '../chatbot/chatbot.component';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ProductListComponent, LoginComponent, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private productService: ProductService, private authService: AuthService,  private cdr: ChangeDetectorRef, private cartService: CartService) {}
  isUserLoggedIn = false; 
  products: any[] = [];
  filteredProducts: any[] = [];
  showForm = false;
  selectedProduct: any = null;
  showChatbot = false;
  cart: any[] = [];
  cartVisible = false;
  totalCompra: number = 0;

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadProducts();
    this.cartService.getUpdatedCart().subscribe((cart: any[]) => {
      console.log('Carrito actualizado en ngOnInit:', cart);
      this.cart = cart;
      this.totalCompra = this.cartService.getTotal();
    });
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

  toggleChatbot() {
    this.showChatbot = !this.showChatbot;
  }
  toggleCart() {
    console.log('Carrito actual:', this.cart);
    this.cartVisible = !this.cartVisible;
    this.totalCompra = this.cartService.getTotal();
    console.log('Cart visible:', this.cartVisible);
  }

  addToCart(product: any, quantity: number) {
    if (quantity > 0 && quantity <= product.stock) {
        this.cartService.addToCart(product.id, quantity).subscribe(response => {
            product.stock = response.newStock;
            this.cartService.updateCart(response.product); 
            this.cart = [...this.cartService.getCart()];
            this.totalCompra = this.cartService.getTotal(); 
            console.log('Carrito actualizado addhome:', this.cart);
            this.cdr.detectChanges(); 
            alert('Producto agregado al carrito');
        });
    } else {
        alert('Cantidad inválida');
    }
  }



  

  checkout() {
    alert('Compra finalizada');
    this.cart = [];
    this.cartVisible = false;
    this.totalCompra = 0;
  }

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

