import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../purchase/purchase.models';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
})
export class ProductImage {
  readonly product = input.required<Product>();
  readonly priority = input(false);
}
