import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { Product } from '../models/product.model';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
})
export class ProductImage {
  readonly product = input.required<Product>();
  readonly priority = input(false);
  readonly eager = input(false);
}
