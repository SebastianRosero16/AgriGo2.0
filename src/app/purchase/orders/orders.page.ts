import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatCop, formatOrderDate } from '../purchase.format';
import { PurchaseOrder } from '../purchase.models';
import { PurchaseStore } from '../purchase.store';
import { AppIcon } from '../../shared/icons/app-icon.component';

@Component({
  imports: [AppIcon, RouterLink],
  selector: 'app-orders-page',
  styleUrl: './orders.page.scss',
  templateUrl: './orders.page.html',
})
export class OrdersPage {
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly orders = this.purchaseStore.orders;
  protected readonly searchTerm = signal('');
  protected readonly formatCop = formatCop;
  protected readonly formatOrderDate = formatOrderDate;
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

  protected productNames(order: PurchaseOrder): string {
    return order.items.map((item) => item.product.name).join(', ');
  }

  protected productCount(order: PurchaseOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  private matchesSearch(order: PurchaseOrder, query: string): boolean {
    return (
      order.id.toLocaleLowerCase('es-CO').includes(query) ||
      order.items.some((item) => item.product.name.toLocaleLowerCase('es-CO').includes(query))
    );
  }
}
