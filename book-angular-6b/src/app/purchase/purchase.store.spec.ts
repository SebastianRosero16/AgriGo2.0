import { CART_STORAGE_KEY, ORDERS_STORAGE_KEY } from './purchase.constants';
import { PurchaseStore } from './purchase.store';

describe('PurchaseStore', () => {
  beforeEach(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  });

  it('starts with sample items and calculates their subtotal', () => {
    const store = new PurchaseStore();

    expect(store.cartCount()).toBe(4);
    expect(store.subtotal()).toBe(64_200);
  });

  it('replaces invalid cart data with the sample cart and reports the recovery', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ quantity: 1 }]));
    const store = new PurchaseStore();

    expect(store.cartCount()).toBe(4);
    expect(store.persistenceNotice()).toContain('carrito guardado no era válido');
  });

  it('updates quantities without going below one and removes an item explicitly', () => {
    const store = new PurchaseStore();
    store.changeQuantity('tomate-cherry', 1);
    expect(store.cartCount()).toBe(5);

    store.changeQuantity('tomate-cherry', -1);
    store.changeQuantity('tomate-cherry', -1);
    store.changeQuantity('tomate-cherry', -1);
    expect(store.cartCount()).toBe(3);

    store.removeItem('tomate-cherry');
    expect(store.cart().some((item) => item.product.id === 'tomate-cherry')).toBe(false);
    expect(store.cartCount()).toBe(2);
  });

  it('creates an order, persists it and clears the cart', () => {
    const store = new PurchaseStore();
    const order = store.createOrder({
      fullName: 'María López',
      phone: '+57 300 123 4567',
      address: 'Carrera 15 # 93-47',
      city: 'Bogotá',
      department: 'Bogotá D. C.',
      postalCode: '110221',
      deliveryDate: '2026-10-26',
      deliveryWindow: 'afternoon',
      instructions: '',
      paymentMethod: 'cash',
    });

    expect(order?.total).toBe(64_200);
    expect(store.cart()).toEqual([]);
    expect(store.findOrder(order?.id ?? '')).toEqual(order);
    expect(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) ?? '[]')).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null')).toEqual([]);
  });

  it('does not create an order when the cart is empty', () => {
    const store = new PurchaseStore();
    store.removeItem('tomate-cherry');
    store.removeItem('lechuga-batavia');
    store.removeItem('cafe-arabica');

    expect(
      store.createOrder({
        fullName: 'María López',
        phone: '+57 300 123 4567',
        address: 'Carrera 15 # 93-47',
        city: 'Bogotá',
        department: 'Bogotá D. C.',
        postalCode: '110221',
        deliveryDate: '2026-10-26',
        deliveryWindow: 'afternoon',
        instructions: '',
        paymentMethod: 'cash',
      }),
    ).toBeNull();
  });
});
