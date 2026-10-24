import { Routes } from '@angular/router';
import { Marketplace } from './marketplace/marketplace';
import { ProductDetail } from './product-detail/product-detail';

export const routes: Routes = [
	{ path: '', component: Marketplace, title: 'AgriGo | Mercado agrícola' },
	{ path: 'producto/:id', component: ProductDetail, title: 'Producto | AgriGo' },
	{ path: '**', redirectTo: '' },
];
