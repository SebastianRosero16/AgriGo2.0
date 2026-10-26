import { computed, Injectable, signal } from '@angular/core';
import {
  CART_STORAGE_KEY,
  MAX_QUANTITY_PER_PRODUCT,
  ORDERS_STORAGE_KEY,
  SHIPPING_COST,
} from './purchase.constants';
import { INITIAL_CART } from './purchase.data';
import { CartItem, PlaceOrderInput, Product, PurchaseOrder } from './purchase.models';

@Injectable({ providedIn: 'root' })
export class PurchaseStore {
  readonly cart = signal<CartItem[]>([]);
  readonly orders = signal<PurchaseOrder[]>([]);
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
    this.orders.set(this.readOrders());
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

  createOrder(details: PlaceOrderInput): PurchaseOrder | null {
    const items = this.cart().map((item) => ({ ...item }));
    if (items.length === 0) {
      return null;
    }

    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const order: PurchaseOrder = {
      id: this.createOrderId(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      items,
      subtotal,
      shipping: SHIPPING_COST,
      total: subtotal + SHIPPING_COST,
      shippingDetails: { ...details },
    };

    const nextOrders = [order, ...this.orders()];
    this.orders.set(nextOrders);
    this.persist(ORDERS_STORAGE_KEY, nextOrders);
    this.saveCart([]);

    return order;
  }

  findOrder(orderId: string): PurchaseOrder | undefined {
    return this.orders().find((order) => order.id === orderId);
  }

  private readCart(): CartItem[] {
    const storedCart = this.readFromStorage(CART_STORAGE_KEY);
    if (storedCart === null) {
      this.saveCart(INITIAL_CART);
      return INITIAL_CART;
    }

    if (!Array.isArray(storedCart) || !storedCart.every((item) => this.isCartItem(item))) {
      this.persistenceNotice.set(
        'El carrito guardado no era válido; se cargó el carrito de ejemplo.',
      );
      this.saveCart(INITIAL_CART);
      return INITIAL_CART;
    }

    return storedCart;
  }

  private readOrders(): PurchaseOrder[] {
    const storedOrders = this.readFromStorage(ORDERS_STORAGE_KEY);
    if (storedOrders === null) {
      return [];
    }

    if (!Array.isArray(storedOrders) || !storedOrders.every((order) => this.isOrder(order))) {
      this.persistenceNotice.set(
        'El historial guardado no era válido; se inició un historial vacío.',
      );
      this.persist(ORDERS_STORAGE_KEY, []);
      return [];
    }

    return storedOrders;
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
      typeof product.color === 'string' &&
      item.quantity <= product.available
    );
  }

  private isOrder(value: unknown): value is PurchaseOrder {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const order = value as Partial<PurchaseOrder>;
    return (
      typeof order.id === 'string' &&
      typeof order.createdAt === 'string' &&
      Number.isFinite(Date.parse(order.createdAt)) &&
      order.status === 'confirmed' &&
      Array.isArray(order.items) &&
      order.items.every((item) => this.isCartItem(item)) &&
      order.items.length > 0 &&
      typeof order.subtotal === 'number' &&
      Number.isFinite(order.subtotal) &&
      typeof order.shipping === 'number' &&
      Number.isFinite(order.shipping) &&
      typeof order.total === 'number' &&
      Number.isFinite(order.total) &&
      order.subtotal >= 0 &&
      order.shipping >= 0 &&
      order.total >= 0 &&
      order.total === order.subtotal + order.shipping &&
      this.isShippingDetails(order.shippingDetails)
    );
  }

  private isShippingDetails(value: unknown): boolean {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const details = value as Partial<PlaceOrderInput>;
    return (
      typeof details.fullName === 'string' &&
      typeof details.phone === 'string' &&
      typeof details.address === 'string' &&
      typeof details.city === 'string' &&
      typeof details.department === 'string' &&
      typeof details.postalCode === 'string' &&
      typeof details.deliveryDate === 'string' &&
      (details.deliveryWindow === 'morning' ||
        details.deliveryWindow === 'afternoon' ||
        details.deliveryWindow === 'evening') &&
      typeof details.instructions === 'string' &&
      (details.paymentMethod === 'cash' || details.paymentMethod === 'bank-transfer')
    );
  }

  private createOrderId(): string {
    const date = new Date();
    const day = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('');
    const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
    return `AG-${day}-${suffix}`;
  }
}
