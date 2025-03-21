import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnChanges() {
    if (this.selectedProduct) {
      this.productForm.patchValue(this.selectedProduct);
    } else {
      this.productForm.reset();
    }
  }

  submitForm() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // ✅ Muestra los errores al intentar registrar
      return;
    }

    this.productRegistered.emit({ ...this.selectedProduct, ...this.productForm.value });
    this.productForm.reset();
  }
}

