import { Routes } from '@angular/router';
import { CheckoutPage } from './purchase/checkout/checkout.page';
import { CartPage } from './purchase/cart/cart.page';
import { OrderConfirmationPage } from './purchase/order-confirmation/order-confirmation.page';
import { OrdersPage } from './purchase/orders/orders.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cart' },
  { path: 'cart', component: CartPage, title: 'Mi carrito | AgriGo' },
  { path: 'checkout', component: CheckoutPage, title: 'Finalizar pedido | AgriGo' },
  { path: 'orders', component: OrdersPage, title: 'Mis pedidos | AgriGo' },
  {
    path: 'orders/:orderId',
    component: OrderConfirmationPage,
    title: 'Detalle del pedido | AgriGo',
  },
  { path: '**', redirectTo: 'cart' },
];
