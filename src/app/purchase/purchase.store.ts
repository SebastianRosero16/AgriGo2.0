import { computed, Injectable, signal } from '@angular/core';
import {
  CART_STORAGE_KEY,
  MAX_QUANTITY_PER_PRODUCT,
  ORDERS_STORAGE_KEY,
  SHIPPING_COST,
} from './purchase.constants';
import { INITIAL_CART } from './purchase.data';
import type { Product } from '../shared/models/product.model';
import {
  CartItem,
  OrderCreationResult,
  PlaceOrderInput,
  PurchaseOrder,
  ShippingDetails,
} from './purchase.models';
import { PURCHASE_MESSAGES } from './purchase.messages';

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

  changeQuantity(productId: number, change: -1 | 1): void {
    const nextCart = this.cart().map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      const quantity = Math.max(
        1,
        Math.min(item.product.stock, MAX_QUANTITY_PER_PRODUCT, item.quantity + change),
      );
      return { ...item, quantity };
    });

    this.saveCart(nextCart);
  }

  removeItem(productId: number): void {
    this.saveCart(this.cart().filter((item) => item.product.id !== productId));
  }

  addProduct(product: Product): void {
    if (!this.isProduct(product) || product.stock < 1) {
      return;
    }

    const existingItem = this.cart().find((item) => item.product.id === product.id);
    const maximumQuantity = Math.min(product.stock, MAX_QUANTITY_PER_PRODUCT);
    const nextQuantity = existingItem ? Math.min(existingItem.quantity + 1, maximumQuantity) : 1;
    if (
      existingItem &&
      existingItem.quantity === nextQuantity &&
      existingItem.product === product
    ) {
      return;
    }

    const nextCart = existingItem
      ? this.cart().map((item) =>
          item.product.id === product.id ? { product, quantity: nextQuantity } : item,
        )
      : [...this.cart(), { product, quantity: nextQuantity }];

    this.saveCart(nextCart);
  }

  restoreDemoCart(): boolean {
    const demoCart = INITIAL_CART.map((item) => ({
      ...item,
      product: { ...item.product },
    }));
    if (!this.persist(CART_STORAGE_KEY, demoCart)) {
      this.persistenceNotice.set(PURCHASE_MESSAGES.storage.demoCartUnavailable);
      return false;
    }

    this.cart.set(demoCart);
    return true;
  }

  createOrder(shippingDetails: PlaceOrderInput): OrderCreationResult {
    const items = this.cart().map((item) => ({
      ...item,
      product: { ...item.product },
    }));
    if (items.length === 0) {
      return { success: false, reason: 'empty-cart' };
    }

    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const order: PurchaseOrder = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      items,
      subtotal,
      shipping: SHIPPING_COST,
      total: subtotal + SHIPPING_COST,
      shippingDetails: { ...shippingDetails },
    };
    const nextOrders = [order, ...this.orders()];

    if (!this.persist(ORDERS_STORAGE_KEY, nextOrders)) {
      return { success: false, reason: 'persistence' };
    }
    if (!this.persist(CART_STORAGE_KEY, [])) {
      const rollbackSucceeded = this.persist(ORDERS_STORAGE_KEY, this.orders());
      if (!rollbackSucceeded) {
        this.persistenceNotice.set(PURCHASE_MESSAGES.storage.orderRollbackFailed);
        return { success: false, reason: 'rollback' };
      }
      return { success: false, reason: 'persistence' };
    }

    this.orders.set(nextOrders);
    this.cart.set([]);
    return { success: true, order };
  }

  findOrder(orderId: string): PurchaseOrder | null {
    return this.orders().find((order) => order.id === orderId) ?? null;
  }

  private readCart(): CartItem[] {
    const storedCart = this.readFromStorage(CART_STORAGE_KEY);
    if (storedCart === null) {
      this.persist(CART_STORAGE_KEY, INITIAL_CART);
      return INITIAL_CART;
    }

    if (!Array.isArray(storedCart) || !storedCart.every((item) => this.isCartItem(item))) {
      this.persistenceNotice.set(PURCHASE_MESSAGES.storage.invalidCart);
      this.persist(CART_STORAGE_KEY, INITIAL_CART);
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
      this.persistenceNotice.set(PURCHASE_MESSAGES.storage.invalidOrders);
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
      this.persistenceNotice.set(PURCHASE_MESSAGES.storage.readFailed);
      console.error(`No se pudieron leer los datos de ${key}.`, error);
      return null;
    }
  }

  private saveCart(cart: CartItem[]): void {
    this.cart.set(cart);
    this.persist(CART_STORAGE_KEY, cart);
  }

  private persist(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      this.persistenceNotice.set(PURCHASE_MESSAGES.storage.saveFailed);
      console.error(`No se pudieron guardar los datos de ${key}.`, error);
      return false;
    }
  }

  private isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const item = value as Partial<CartItem>;
    const product = item.product;
    return (
      typeof item.quantity === 'number' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= MAX_QUANTITY_PER_PRODUCT &&
      this.isProduct(product) &&
      item.quantity <= product.stock
    );
  }

  private isProduct(value: unknown): value is Product {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const product = value as Partial<Product>;
    return (
      typeof product.id === 'number' &&
      Number.isInteger(product.id) &&
      product.id > 0 &&
      typeof product.name === 'string' &&
      typeof product.description === 'string' &&
      typeof product.category === 'string' &&
      typeof product.price === 'number' &&
      Number.isFinite(product.price) &&
      product.price >= 0 &&
      typeof product.stock === 'number' &&
      Number.isInteger(product.stock) &&
      product.stock >= 0 &&
      typeof product.unit === 'string' &&
      typeof product.producer === 'string' &&
      typeof product.location === 'string' &&
      typeof product.imageUrl === 'string'
    );
  }

  private isOrder(value: unknown): value is PurchaseOrder {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const order = value as Partial<PurchaseOrder>;
    if (!Array.isArray(order.items) || !order.items.every((item) => this.isCartItem(item))) {
      return false;
    }
    const subtotal = order.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    return (
      typeof order.id === 'string' &&
      order.id.length > 0 &&
      typeof order.createdAt === 'string' &&
      Number.isFinite(Date.parse(order.createdAt)) &&
      order.status === 'confirmed' &&
      order.items.length > 0 &&
      typeof order.subtotal === 'number' &&
      order.subtotal === subtotal &&
      typeof order.shipping === 'number' &&
      order.shipping === SHIPPING_COST &&
      typeof order.total === 'number' &&
      order.total === order.subtotal + order.shipping &&
      this.isShippingDetails(order.shippingDetails)
    );
  }

  private isShippingDetails(value: unknown): value is ShippingDetails {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const details = value as Partial<ShippingDetails>;
    const deliveryDate = details.deliveryDate;
    const hasValidDeliveryDate =
      typeof deliveryDate === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate) &&
      Number.isFinite(Date.parse(deliveryDate)) &&
      new Date(deliveryDate).toISOString().slice(0, 10) === deliveryDate;
    return (
      typeof details.fullName === 'string' &&
      typeof details.phone === 'string' &&
      typeof details.address === 'string' &&
      typeof details.city === 'string' &&
      typeof details.department === 'string' &&
      typeof details.postalCode === 'string' &&
      hasValidDeliveryDate &&
      (details.deliveryWindow === 'morning' ||
        details.deliveryWindow === 'afternoon' ||
        details.deliveryWindow === 'evening') &&
      typeof details.instructions === 'string' &&
      (details.paymentMethod === 'cash' || details.paymentMethod === 'bank-transfer')
    );
  }
}
