import { Component, input } from '@angular/core';
import { Product } from '../../purchase/purchase.models';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
})
export class ProductImage {
  readonly product = input.required<Product>();
}
