import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DELIVERY_WINDOWS, PAYMENT_METHODS } from '../purchase.constants';
import { formatCop, formatDeliveryDate, formatOrderDate } from '../purchase.format';
import { PurchaseStore } from '../purchase.store';
import { AppIcon } from '../../shared/icons/app-icon.component';
import { PURCHASE_MESSAGES } from '../purchase.messages';

@Component({
  imports: [AppIcon, RouterLink],
  selector: 'app-order-confirmation-page',
  styleUrl: './order-confirmation.page.scss',
  templateUrl: './order-confirmation.page.html',
})
export class OrderConfirmationPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly purchaseStore = inject(PurchaseStore);

  private readonly routeParams = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });

  protected readonly order = computed(() => {
    const orderId = this.routeParams()?.get('orderId');
    return orderId ? this.purchaseStore.findOrder(orderId) : undefined;
  });
  protected readonly formatCop = formatCop;
  protected readonly formatDeliveryDate = formatDeliveryDate;
  protected readonly formatOrderDate = formatOrderDate;
  protected readonly deliveryWindowLabel = (value: string): string =>
    DELIVERY_WINDOWS.find((window) => window.value === value)?.label ??
    PURCHASE_MESSAGES.orderConfirmation.unspecifiedValue;
  protected readonly paymentMethodLabel = (value: string): string =>
    PAYMENT_METHODS.find((method) => method.value === value)?.label ??
    PURCHASE_MESSAGES.orderConfirmation.unspecifiedValue;
}
