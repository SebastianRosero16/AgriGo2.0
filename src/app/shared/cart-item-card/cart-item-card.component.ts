import { Component, input, output } from '@angular/core';
import { CartItem } from '../../purchase/purchase.models';
import { formatCop } from '../../purchase/purchase.format';
import { AppIcon } from '../icons/app-icon.component';
import { ProductImage } from '../media/product-image.component';

@Component({
  imports: [AppIcon, ProductImage],
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrl: './cart-item-card.component.scss',
})
export class CartItemCard {
  readonly item = input.required<CartItem>();
  readonly quantityChange = output<-1 | 1>();
  readonly remove = output<void>();

  protected readonly formatCop = formatCop;
}
