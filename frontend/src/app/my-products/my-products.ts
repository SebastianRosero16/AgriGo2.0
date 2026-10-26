import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-products.html',
  styleUrl: './my-products.scss',
})
export class MyProducts {
  private productService = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  confirmDeleteId = signal<number | null>(null);

  ngOnInit(): void {
    this.products.set(this.productService.getAll());
  }

  stockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock <= 5) return 'stock-low';
    return 'stock-ok';
  }

  stockLabel(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock <= 5) return 'Stock bajo';
    return 'En stock';
  }

  editProduct(id: number): void {
    this.router.navigate(['/editar', id]);
  }

  askDelete(id: number): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id !== null) {
      this.productService.remove(id);
      this.products.set(this.productService.getAll());
      this.confirmDeleteId.set(null);
    }
  }
}
