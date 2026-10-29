import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DELIVERY_WINDOWS } from '../purchase.constants';
import { formatCop, formatDeliveryDate, formatOrderDate } from '../purchase.format';
import { DeliveryWindow, PurchaseOrder } from '../purchase.models';
import { PurchaseStore } from '../purchase.store';
import { AppIcon } from '../../shared/icons/app-icon.component';
import { ProductImage } from '../../shared/media/product-image.component';
import { RouterLink } from '@angular/router';
import { PURCHASE_MESSAGES } from '../purchase.messages';

@Component({
  imports: [AppIcon, NgFor, NgIf, ProductImage, RouterLink],
  selector: 'app-orders-page',
  styleUrl: './orders.page.scss',
  templateUrl: './orders.page.html',
})
export class OrdersPage {
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly orders = this.purchaseStore.orders;
  protected readonly searchTerm = signal('');
  protected readonly formatCop = formatCop;
  protected readonly formatDeliveryDate = formatDeliveryDate;
  protected readonly formatOrderDate = formatOrderDate;
  protected readonly deliveryWindowLabel = (value: DeliveryWindow): string =>
    DELIVERY_WINDOWS.find((window) => window.value === value)?.label ??
    PURCHASE_MESSAGES.orders.unavailableDeliveryWindow;
  protected readonly filteredOrders = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase('es-CO');
    if (!query) {
      return this.orders();
    }

    return this.orders().filter((order) => this.matchesSearch(order, query));
  });

  protected updateSearch(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.searchTerm.set(input.value);
    }
  }

  protected productCount(order: PurchaseOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  protected producerNames(order: PurchaseOrder): string {
    return Array.from(new Set(order.items.map((item) => item.product.producer))).join(', ');
  }

  private matchesSearch(order: PurchaseOrder, query: string): boolean {
    return (
      order.id.toLocaleLowerCase('es-CO').includes(query) ||
      order.items.some((item) => item.product.name.toLocaleLowerCase('es-CO').includes(query))
    );
  }
}
