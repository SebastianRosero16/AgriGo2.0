import { Product } from '../models/product.model';

// Datos semilla del productor — simula los productos propios publicados
export let MY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Tomate chonto',
    description: 'Tomates frescos, cosechados en su punto y seleccionados a mano.',
    category: 'Verduras',
    price: 4200,
    unit: 'kg',
    stock: 28,
    producer: 'Mi Finca',
    location: 'Fusagasugá, Cundinamarca',
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Papa pastusa',
    description: 'Papa de altura, firme y fresca, directamente de la cosecha.',
    category: 'Granos y tubérculos',
    price: 2800,
    unit: 'kg',
    stock: 52,
    producer: 'Mi Finca',
    location: 'Fusagasugá, Cundinamarca',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85',
  },
];
