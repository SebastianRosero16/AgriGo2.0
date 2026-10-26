import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItemCard } from '../../shared/cart-item-card/cart-item-card.component';
import { AppIcon } from '../../shared/icons/app-icon.component';
import { OrderSummary } from '../../shared/order-summary/order-summary.component';
import { CartItem } from '../purchase.models';
import { PurchaseStore } from '../purchase.store';

@Component({
  imports: [CartItemCard, AppIcon, OrderSummary, RouterLink],
  selector: 'app-cart-page',
  styleUrl: './cart.page.scss',
  templateUrl: './cart.page.html',
})
export class CartPage {
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly cart = this.purchaseStore.cart;
  protected readonly itemCount = this.purchaseStore.cartCount;

  protected changeQuantity(item: CartItem, change: -1 | 1): void {
    this.purchaseStore.changeQuantity(item.product.id, change);
  }

  protected removeItem(item: CartItem): void {
    this.purchaseStore.removeItem(item.product.id);
  }
}
