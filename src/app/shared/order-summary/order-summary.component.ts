import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../purchase/purchase.models';
import { formatCop } from '../../purchase/purchase.format';
import { AppIcon } from '../icons/app-icon.component';
import { ProductImage } from '../media/product-image.component';

@Component({
  imports: [AppIcon, ProductImage, RouterLink],
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummary {
  readonly items = input.required<readonly CartItem[]>();
  readonly shipping = input(0);
  readonly showItems = input(false);
  readonly showCheckoutAction = input(false);
  readonly note = input('');

  protected readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );
  protected readonly total = computed(() => this.subtotal() + this.shipping());
  protected readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );
  protected readonly formatCop = formatCop;
}
