import { Product } from './purchase.models';

export const SAMPLE_CART: Product[] = [
  {
    id: 'tomate-cherry',
    name: 'Tomate cherry orgánico',
    category: 'Frutas y verduras',
    price: 8500,
    unit: 'kg',
    available: 20,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    color: 'tomato',
  },
  {
    id: 'lechuga-batavia',
    name: 'Lechuga batavia hidropónica',
    category: 'Hortalizas',
    price: 5200,
    unit: 'unidad',
    available: 15,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    color: 'lettuce',
  },
  {
    id: 'cafe-arabica',
    name: 'Café arábica especial',
    category: 'Café y cacao',
    price: 42000,
    unit: 'kg',
    available: 10,
    producer: 'Carlos Rodríguez',
    location: 'Facatativá, Cundinamarca',
    color: 'coffee',
  },
];

export const INITIAL_CART = SAMPLE_CART.map((product, index) => ({
  product,
  quantity: index === 0 ? 2 : 1,
}));
