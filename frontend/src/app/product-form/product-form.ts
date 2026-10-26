import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

const CATEGORIES = ['Frutas', 'Verduras', 'Granos y tubérculos'];

function positiveNumber(control: AbstractControl): ValidationErrors | null {
  const v = Number(control.value);
  return isNaN(v) || v <= 0 ? { positiveNumber: true } : null;
}

function nonNegativeInteger(control: AbstractControl): ValidationErrors | null {
  const v = Number(control.value);
  return isNaN(v) || v < 0 || !Number.isInteger(v) ? { nonNegativeInteger: true } : null;
}

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  isEditMode = signal(false);
  editId = signal<number | null>(null);
  categories = CATEGORIES;
  submitted = signal(false);

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
    category:    ['', Validators.required],
    price:       [null as unknown as number, [Validators.required, positiveNumber]],
    unit:        ['', Validators.required],
    stock:       [null as unknown as number, [Validators.required, nonNegativeInteger]],
    producer:    ['', [Validators.required, Validators.minLength(3)]],
    location:    ['', Validators.required],
    imageUrl:    ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const product = this.productService.getById(Number(id));
      if (product) {
        this.isEditMode.set(true);
        this.editId.set(product.id);
        this.form.patchValue({ ...product });
      } else {
        this.router.navigate(['/mis-productos']);
      }
    }
  }

  get f() { return this.form.controls; }

  fieldError(name: keyof typeof this.form.controls): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched || this.submitted());
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const value = this.form.getRawValue() as any;

    if (this.isEditMode()) {
      this.productService.update(this.editId()!, {
        name:        value.name,
        description: value.description,
        category:    value.category,
        price:       Number(value.price),
        unit:        value.unit,
        stock:       Number(value.stock),
        producer:    value.producer,
        location:    value.location,
        imageUrl:    value.imageUrl,
      });
    } else {
      this.productService.add({
        name:        value.name,
        description: value.description,
        category:    value.category,
        price:       Number(value.price),
        unit:        value.unit,
        stock:       Number(value.stock),
        producer:    value.producer,
        location:    value.location,
        imageUrl:    value.imageUrl,
      });
    }
    this.router.navigate(['/mis-productos']);
  }

  cancel(): void {
    this.router.navigate(['/mis-productos']);
  }
}
