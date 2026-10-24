import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTS } from '../data/products';
import { Product } from '../models/product.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-marketplace',
  styleUrl: './marketplace.scss',
  templateUrl: './marketplace.html',
})
export class Marketplace {
  products = signal<Product[]>(PRODUCTS);
  categories = ['Todos', 'Frutas', 'Verduras', 'Granos y tubérculos'];
  searchTerm = signal('');
  selectedCategory = signal('Todos');

  get filteredProducts(): Product[] {
    const search = this.searchTerm().trim().toLocaleLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch =
        product.name.toLocaleLowerCase().includes(search) ||
        product.producer.toLocaleLowerCase().includes(search);
      const matchesCategory = category === 'Todos' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('Todos');
  }
}