import { computed, Injectable, signal } from '@angular/core';
import { CART_STORAGE_KEY, MAX_QUANTITY_PER_PRODUCT, SHIPPING_COST } from './purchase.constants';
import { INITIAL_CART } from './purchase.data';
import { CartItem, Product } from './purchase.models';

@Injectable({ providedIn: 'root' })
export class PurchaseStore {
  readonly cart = signal<CartItem[]>([]);
  readonly persistenceNotice = signal('');

  readonly cartCount = computed(() =>
    this.cart().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.cart().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );
  readonly total = computed(() => this.subtotal() + SHIPPING_COST);

  constructor() {
    this.cart.set(this.readCart());
  }

  changeQuantity(productId: string, change: -1 | 1): void {
    const nextCart = this.cart().map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      const quantity = Math.max(
        1,
        Math.min(item.product.available, MAX_QUANTITY_PER_PRODUCT, item.quantity + change),
      );
      return { ...item, quantity };
    });

    this.saveCart(nextCart);
  }

  removeItem(productId: string): void {
    this.saveCart(this.cart().filter((item) => item.product.id !== productId));
  }

  private readCart(): CartItem[] {
    const storedCart = this.readFromStorage(CART_STORAGE_KEY);
    if (storedCart === null) {
      this.persist(CART_STORAGE_KEY, INITIAL_CART);
      return INITIAL_CART;
    }

    if (!Array.isArray(storedCart) || !storedCart.every((item) => this.isCartItem(item))) {
      this.persistenceNotice.set(
        'El carrito guardado no era válido; se cargó el carrito de ejemplo.',
      );
      this.persist(CART_STORAGE_KEY, INITIAL_CART);
      return INITIAL_CART;
    }

    return storedCart;
  }

  private readFromStorage(key: string): unknown | null {
    try {
      const value = localStorage.getItem(key);
      return value === null ? null : (JSON.parse(value) as unknown);
    } catch (error) {
      this.persistenceNotice.set('No fue posible leer los datos guardados en este navegador.');
      console.error(`No se pudieron leer los datos de ${key}.`, error);
      return null;
    }
  }

  private saveCart(cart: CartItem[]): void {
    this.cart.set(cart);
    this.persist(CART_STORAGE_KEY, cart);
  }

  private persist(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      this.persistenceNotice.set(
        'Los cambios se conservarán solo mientras esta pestaña permanezca abierta.',
      );
      console.error(`No se pudieron guardar los datos de ${key}.`, error);
    }
  }

  private isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const item = value as Partial<CartItem>;
    const product = item.product as Partial<Product> | undefined;
    return (
      typeof item.quantity === 'number' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= MAX_QUANTITY_PER_PRODUCT &&
      typeof product?.id === 'string' &&
      typeof product.name === 'string' &&
      typeof product.category === 'string' &&
      typeof product.price === 'number' &&
      Number.isFinite(product.price) &&
      product.price >= 0 &&
      typeof product.available === 'number' &&
      Number.isInteger(product.available) &&
      product.available > 0 &&
      typeof product.unit === 'string' &&
      typeof product.producer === 'string' &&
      typeof product.location === 'string' &&
      typeof product.imageSrc === 'string' &&
      typeof product.imageAlt === 'string' &&
      item.quantity <= product.available
    );
  }
}
