import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnChanges {
  @Output() productRegistered: EventEmitter<any> = new EventEmitter();
  @Input() selectedProduct: any = null;

  productForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnChanges() {
    if (this.selectedProduct) {
      this.isEditing = true;
      this.productForm.patchValue(this.selectedProduct);
    } else {
      this.isEditing = false;
      this.productForm.reset();
    }
  }

  submitForm() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.value;

    if (this.isEditing && this.selectedProduct?.id) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe(() => {
        this.productRegistered.emit();
        this.productForm.reset();
      });
    } else {
      this.productService.addProduct(productData).subscribe(() => {
        this.productRegistered.emit();
        this.productForm.reset();
      });
    }
  }
}



