import { Injectable, signal } from '@angular/core';
import { MY_PRODUCTS } from '../data/my-products';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = signal<Product[]>([...MY_PRODUCTS]);

  getAll(): Product[] {
    return this.products();
  }

  getById(id: number): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  add(product: Omit<Product, 'id'>): void {
    const newId = Math.max(0, ...this.products().map((p) => p.id)) + 1;
    this.products.update((list) => [...list, { id: newId, ...product }]);
  }

  update(id: number, changes: Omit<Product, 'id'>): void {
    this.products.update((list) =>
      list.map((p) => (p.id === id ? { id, ...changes } : p))
    );
  }

  remove(id: number): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }
}
