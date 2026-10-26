import { Routes } from '@angular/router';
import { MyProducts } from './my-products/my-products';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
  { path: '',               redirectTo: 'mis-productos', pathMatch: 'full' },
  { path: 'mis-productos',  component: MyProducts,   title: 'Mis publicaciones | AgriGo' },
  { path: 'publicar',       component: ProductForm,  title: 'Publicar producto | AgriGo' },
  { path: 'editar/:id',     component: ProductForm,  title: 'Editar producto | AgriGo' },
  { path: '**',             redirectTo: 'mis-productos' },
];
