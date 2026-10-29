import { vi } from 'vitest';
import { CART_STORAGE_KEY, ORDERS_STORAGE_KEY } from './purchase.constants';
import { PlaceOrderInput } from './purchase.models';
import { SAMPLE_PRODUCTS } from './purchase.data';
import { PurchaseStore } from './purchase.store';
import type { Product } from '../shared/models/product.model';

const additionalProduct: Product = {
  ...SAMPLE_PRODUCTS[0],
  id: 4,
  name: 'Fresas frescas',
  description: 'Fresas de cosecha local.',
  stock: 3,
};

const validShippingDetails: PlaceOrderInput = {
  fullName: 'Héctor',
  phone: '+57 300 123 4567',
  address: 'Calle 10 # 20-30',
  city: 'Bogotá',
  department: 'Cundinamarca',
  postalCode: '',
  deliveryDate: '2026-10-25',
  deliveryWindow: 'afternoon',
  instructions: '',
  paymentMethod: 'cash',
};

describe('PurchaseStore cart', () => {
  beforeEach(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  });

  it('initializes the demonstration cart and derives its subtotal', () => {
    const store = new PurchaseStore();

    expect(store.cartCount()).toBe(4);
    expect(store.subtotal()).toBe(64_200);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')).toHaveLength(3);
  });

  it('persists quantity changes and enforces the available stock', () => {
    const store = new PurchaseStore();

    for (let index = 0; index < 30; index += 1) {
      store.changeQuantity(1, 1);
    }

    const tomatoes = store.cart().find((item) => item.product.id === 1);
    expect(tomatoes?.quantity).toBe(tomatoes?.product.stock);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')[0].quantity).toBe(
      tomatoes?.product.stock,
    );
  });

  it('does not decrement below one and removes an item explicitly', () => {
    const store = new PurchaseStore();

    store.changeQuantity(2, -1);
    expect(store.cart().find((item) => item.product.id === 2)?.quantity).toBe(1);

    store.removeItem(2);
    expect(store.cart().some((item) => item.product.id === 2)).toBe(false);
  });

  it('adds a new product to the cart and persists it', () => {
    const store = new PurchaseStore();

    store.addProduct(additionalProduct);

    expect(store.cart().find((item) => item.product.id === additionalProduct.id)).toEqual({
      product: additionalProduct,
      quantity: 1,
    });
    expect(store.cartCount()).toBe(5);
    expect(store.subtotal()).toBe(72_700);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')).toContainEqual({
      product: additionalProduct,
      quantity: 1,
    });
    expect(
      new PurchaseStore().cart().find((item) => item.product.id === additionalProduct.id),
    ).toEqual({ product: additionalProduct, quantity: 1 });
  });

  it('increases the quantity when adding a product already in the cart', () => {
    const store = new PurchaseStore();

    store.addProduct(SAMPLE_PRODUCTS[0]);

    expect(store.cart().find((item) => item.product.id === SAMPLE_PRODUCTS[0].id)?.quantity).toBe(
      3,
    );
  });

  it('does not add products beyond their available stock', () => {
    const store = new PurchaseStore();
    const limitedProduct = { ...additionalProduct, stock: 1 };

    store.addProduct(limitedProduct);
    store.addProduct(limitedProduct);

    expect(store.cart().find((item) => item.product.id === limitedProduct.id)?.quantity).toBe(1);
  });

  it('recovers from invalid stored cart data with a visible notice', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ quantity: 1 }]));
    const store = new PurchaseStore();

    expect(store.cartCount()).toBe(4);
    expect(store.persistenceNotice()).toContain('carrito guardado no era válido');
  });

  it('restores an intentionally empty cart instead of reseeding it', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    const store = new PurchaseStore();

    expect(store.cart()).toEqual([]);
    expect(store.cartCount()).toBe(0);
  });

  it('restores the demonstration products after an empty cart', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    const store = new PurchaseStore();

    expect(store.restoreDemoCart()).toBe(true);
    expect(store.cartCount()).toBe(4);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')).toHaveLength(3);
  });

  it('does not change an empty cart when restoring demo products cannot be persisted', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    const store = new PurchaseStore();
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      if (key === CART_STORAGE_KEY) {
        throw new DOMException('Storage is unavailable.', 'SecurityError');
      }
      originalSetItem.call(localStorage, key, value);
    });

    expect(store.restoreDemoCart()).toBe(false);
    expect(store.cart()).toEqual([]);
    expect(store.persistenceNotice()).toContain('No fue posible cargar los productos de ejemplo');
    setItem.mockRestore();
  });

  it('creates and persists an order snapshot before clearing the cart', () => {
    const store = new PurchaseStore();
    const order = store.createOrder(validShippingDetails);

    expect(order.success).toBe(true);
    if (!order.success) {
      throw new Error('Expected order creation to succeed.');
    }
    expect(order.order.items).toHaveLength(3);
    expect(order.order.total).toBe(64_200);
    expect(store.findOrder(order.order.id)).toEqual(order.order);
    expect(store.cart()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? '[]')).toEqual([order.order]);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null')).toEqual([]);
    expect(new PurchaseStore().findOrder(order.order.id)).toEqual(order.order);
  });

  it('does not create an order when the cart is empty', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    const store = new PurchaseStore();

    expect(store.createOrder(validShippingDetails)).toEqual({
      success: false,
      reason: 'empty-cart',
    });
    expect(store.orders()).toEqual([]);
  });

  it('keeps the cart when the order cannot be persisted', () => {
    const store = new PurchaseStore();
    const originalCart = store.cart();
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      if (key === ORDERS_STORAGE_KEY) {
        throw new DOMException('Storage is full.', 'QuotaExceededError');
      }
      originalSetItem.call(localStorage, key, value);
    });

    const result = store.createOrder(validShippingDetails);

    expect(result).toEqual({ success: false, reason: 'persistence' });
    expect(store.cart()).toEqual(originalCart);
    expect(store.orders()).toEqual([]);
    setItem.mockRestore();
  });

  it('rolls back the order when clearing the cart cannot be persisted', () => {
    const store = new PurchaseStore();
    const originalCart = store.cart();
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      if (key === CART_STORAGE_KEY && value === '[]') {
        throw new DOMException('Storage is unavailable.', 'SecurityError');
      }
      originalSetItem.call(localStorage, key, value);
    });

    const result = store.createOrder(validShippingDetails);

    expect(result).toEqual({ success: false, reason: 'persistence' });
    expect(store.cart()).toEqual(originalCart);
    expect(store.orders()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? 'null')).toEqual([]);
    setItem.mockRestore();
  });

  it('warns to review the order history if rollback also fails', () => {
    const store = new PurchaseStore();
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      if (
        (key === CART_STORAGE_KEY && value === '[]') ||
        (key === ORDERS_STORAGE_KEY && value === '[]')
      ) {
        throw new DOMException('Storage is unavailable.', 'SecurityError');
      }
      originalSetItem.call(localStorage, key, value);
    });

    const result = store.createOrder(validShippingDetails);

    expect(result).toEqual({ success: false, reason: 'rollback' });
    expect(store.cart()).not.toHaveLength(0);
    expect(store.orders()).toEqual([]);
    expect(store.persistenceNotice()).toContain('Revisa tus pedidos antes de volver a intentarlo');
    expect(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? '[]')).toHaveLength(1);
    setItem.mockRestore();
  });

  it('recovers from malformed saved orders without throwing', () => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([{ items: {} }]));
    const store = new PurchaseStore();

    expect(store.orders()).toEqual([]);
    expect(store.persistenceNotice()).toContain('historial guardado no era válido');
    expect(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? 'null')).toEqual([]);
  });

  it('rejects saved delivery dates that are not real calendar dates', () => {
    const store = new PurchaseStore();
    const result = store.createOrder(validShippingDetails);
    if (!result.success) {
      throw new Error('Expected order creation to succeed.');
    }
    const invalidOrder = {
      ...result.order,
      shippingDetails: { ...result.order.shippingDetails, deliveryDate: '2026-02-31' },
    };
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([invalidOrder]));

    expect(new PurchaseStore().orders()).toEqual([]);
  });
});
