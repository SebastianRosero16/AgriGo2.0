import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItemCard } from '../../shared/cart-item-card/cart-item-card.component';
import { AppIcon } from '../../shared/icons/app-icon.component';
import { OrderSummary } from '../../shared/order-summary/order-summary.component';
import { INITIAL_CART } from '../purchase.data';
import { CartItem } from '../purchase.models';
import { PurchaseStore } from '../purchase.store';

interface SellerGroup {
  readonly id: string;
  readonly headingId: string;
  readonly producer: string;
  readonly location: string;
  readonly items: readonly CartItem[];
}

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
  protected priorityProductId = this.cart()[0]?.product.id;
  protected readonly sellerGroups = computed(() => {
    const groups = new Map<
      string,
      { headingId: string; producer: string; location: string; items: CartItem[] }
    >();

    for (const item of this.cart()) {
      const { producer, location } = item.product;
      const id = JSON.stringify([producer, location]);
      const group = groups.get(id) ?? {
        headingId: `seller-${groups.size}`,
        producer,
        location,
        items: [],
      };
      group.items.push(item);
      groups.set(id, group);
    }

    return Array.from(groups, ([id, group]): SellerGroup => ({ id, ...group }));
  });

  protected changeQuantity(item: CartItem, change: -1 | 1): void {
    this.purchaseStore.changeQuantity(item.product.id, change);
  }

  protected removeItem(item: CartItem): void {
    this.purchaseStore.removeItem(item.product.id);
  }

  protected restoreDemoCart(): void {
    this.priorityProductId = INITIAL_CART[0].product.id;
    this.purchaseStore.restoreDemoCart();
  }
}
