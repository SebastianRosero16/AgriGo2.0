import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DELIVERY_WINDOWS, PAYMENT_METHODS, SHIPPING_COST } from '../purchase.constants';
import { formatCop } from '../purchase.format';
import { DeliveryWindow, PaymentMethod } from '../purchase.models';
import { PurchaseStore } from '../purchase.store';
import { OrderSummary } from '../../shared/order-summary/order-summary.component';
import { AppIcon } from '../../shared/icons/app-icon.component';
import { PURCHASE_MESSAGES } from '../purchase.messages';

@Component({
  imports: [AppIcon, OrderSummary, ReactiveFormsModule, RouterLink],
  selector: 'app-checkout-page',
  styleUrl: './checkout.page.scss',
  templateUrl: './checkout.page.html',
})
export class CheckoutPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly cart = this.purchaseStore.cart;
  protected readonly total = this.purchaseStore.total;
  protected readonly shippingCost = SHIPPING_COST;
  protected readonly formatCop = formatCop;
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly deliveryWindows = DELIVERY_WINDOWS;
  protected readonly minDeliveryDate = this.getMinimumDate();
  protected submitError = '';

  protected readonly checkoutForm = this.formBuilder.nonNullable.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(3),
        Validators.maxLength(80),
      ],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9](?:[0-9\s()-]{5,18})[0-9]$/)]],
    address: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(5),
        Validators.maxLength(120),
      ],
    ],
    city: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(2),
        Validators.maxLength(60),
      ],
    ],
    department: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(2),
        Validators.maxLength(60),
      ],
    ],
    postalCode: ['', Validators.pattern(/^\d{5,10}$/)],
    deliveryDate: [this.minDeliveryDate, [Validators.required, this.notPastDate()]],
    deliveryWindow: this.formBuilder.nonNullable.control<DeliveryWindow>(
      'afternoon',
      Validators.required,
    ),
    instructions: ['', Validators.maxLength(250)],
    paymentMethod: this.formBuilder.nonNullable.control<PaymentMethod>('cash', Validators.required),
  });

  protected submitOrder(): void {
    this.submitError = '';
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.invalid) {
      return;
    }

    const result = this.purchaseStore.createOrder(this.checkoutForm.getRawValue());
    if (!result.success) {
      this.submitError = PURCHASE_MESSAGES.checkout.orderCreation[result.reason];
      return;
    }

    void this.router.navigate(['/orders', result.order.id]);
  }

  protected isInvalid(controlName: keyof typeof this.checkoutForm.controls): boolean {
    const control = this.checkoutForm.controls[controlName];
    return control.invalid && control.touched;
  }

  private notPastDate(): ValidatorFn {
    return (control): ValidationErrors | null => {
      const dateValue = control.value as string;
      return dateValue && dateValue < this.getMinimumDate() ? { minDate: true } : null;
    };
  }

  private getMinimumDate(): string {
    const minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() + 1);
    const localDate = new Date(minimumDate.getTime() - minimumDate.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 10);
  }
}
