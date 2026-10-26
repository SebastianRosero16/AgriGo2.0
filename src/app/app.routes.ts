import { Routes } from '@angular/router';
import { CartPage } from './purchase/cart/cart.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cart' },
  { path: 'cart', component: CartPage, title: 'Mi carrito | AgriGo' },
  { path: '**', redirectTo: 'cart' },
];
