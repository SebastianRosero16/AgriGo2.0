import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../purchase.models';
import { SHIPPING_COST } from '../purchase.constants';
import { formatCop } from '../purchase.format';
import { PurchaseStore } from '../purchase.store';

@Component({
  imports: [RouterLink],
  selector: 'app-cart-page',
  styleUrl: './cart.page.scss',
  templateUrl: './cart.page.html',
})
export class CartPage {
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly cart = this.purchaseStore.cart;
  protected readonly itemCount = this.purchaseStore.cartCount;
  protected readonly subtotal = this.purchaseStore.subtotal;
  protected readonly total = this.purchaseStore.total;
  protected readonly shippingCost = SHIPPING_COST;
  protected readonly formatCop = formatCop;

  protected changeQuantity(item: CartItem, change: -1 | 1): void {
    this.purchaseStore.changeQuantity(item.product.id, change);
  }

  protected removeItem(item: CartItem): void {
    this.purchaseStore.removeItem(item.product.id);
  }
}
