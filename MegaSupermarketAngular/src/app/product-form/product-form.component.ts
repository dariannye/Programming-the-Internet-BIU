import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  submitForm() {
    if (this.productForm.valid) {
      console.log('Producto Registrado:', this.productForm.value);
    } else {
      console.log('Formulario Inválido');
    }
  }
}

