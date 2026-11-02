import type { Product } from '../shared/models/product.model';

export const SAMPLE_PRODUCTS: readonly Product[] = [
  {
    id: 1,
    name: 'Tomate cherry orgánico',
    description: 'Tomates cherry frescos cultivados localmente.',
    category: 'Frutas y verduras',
    price: 8500,
    unit: 'kg',
    stock: 20,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    imageUrl: '/assets/products/cherry-tomatoes.svg',
  },
  {
    id: 2,
    name: 'Lechuga batavia hidropónica',
    description: 'Lechuga batavia cultivada en sistema hidropónico.',
    category: 'Hortalizas',
    price: 5200,
    unit: 'unidad',
    stock: 15,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    imageUrl: '/assets/products/hydroponic-lettuce.svg',
  },
  {
    id: 3,
    name: 'Café arábica especial',
    description: 'Café arábica de origen, tostado para conservar su aroma.',
    category: 'Café y cacao',
    price: 42000,
    unit: 'kg',
    stock: 10,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    imageUrl: '/assets/products/arabica-coffee.svg',
  },
];

export const INITIAL_CART = SAMPLE_PRODUCTS.map((product, index) => ({
  product,
  quantity: index === 0 ? 2 : 1,
}));
