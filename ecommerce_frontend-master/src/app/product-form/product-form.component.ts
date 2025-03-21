import { Component, Output, EventEmitter } from '@angular/core';
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
export class ProductFormComponent {
  @Output() productRegistered: EventEmitter<any> = new EventEmitter();  // Emite evento hacia el parent

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
      this.productRegistered.emit(this.productForm.value);  // Emitir el producto registrado al padre
      this.productForm.reset();  // Resetear formulario después de enviar
    } else {
      this.validateFormFields();  // Validar campos manualmente
    }
  }

  // Método adicional para asegurarse de que los errores se disparen cuando el formulario no es válido
  validateFormFields() {
    for (const control in this.productForm.controls) {
      if (this.productForm.controls.hasOwnProperty(control)) {
        this.productForm.controls[control].markAsTouched();
      }
    }
  }
}
