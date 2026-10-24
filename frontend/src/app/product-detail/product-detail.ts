import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PRODUCTS } from '../data/products';
import { Product } from '../models/product.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-product-detail',
  styleUrl: './product-detail.scss',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  product: Product | undefined;

  constructor(route: ActivatedRoute) {
    const productId = Number(route.snapshot.paramMap.get('id'));
    this.product = PRODUCTS.find((item) => item.id === productId);
  }
}