import { Routes } from '@angular/router';
import { CheckoutPage } from './purchase/checkout/checkout.page';
import { CartPage } from './purchase/cart/cart.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cart' },
  { path: 'cart', component: CartPage, title: 'Mi carrito | AgriGo' },
  { path: 'checkout', component: CheckoutPage, title: 'Finalizar pedido | AgriGo' },
  { path: '**', redirectTo: 'cart' },
];
