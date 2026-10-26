import { CART_STORAGE_KEY } from './purchase.constants';
import { PurchaseStore } from './purchase.store';

describe('PurchaseStore cart', () => {
  beforeEach(() => localStorage.removeItem(CART_STORAGE_KEY));

  it('initializes the demonstration cart and derives its subtotal', () => {
    const store = new PurchaseStore();

    expect(store.cartCount()).toBe(4);
    expect(store.subtotal()).toBe(64_200);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')).toHaveLength(3);
  });

  it('persists quantity changes and enforces the available stock', () => {
    const store = new PurchaseStore();

    for (let index = 0; index < 30; index += 1) {
      store.changeQuantity('tomate-cherry', 1);
    }

    const tomatoes = store.cart().find((item) => item.product.id === 'tomate-cherry');
    expect(tomatoes?.quantity).toBe(tomatoes?.product.available);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')[0].quantity).toBe(
      tomatoes?.product.available,
    );
  });

  it('does not decrement below one and removes an item explicitly', () => {
    const store = new PurchaseStore();

    store.changeQuantity('lechuga-batavia', -1);
    expect(store.cart().find((item) => item.product.id === 'lechuga-batavia')?.quantity).toBe(1);

    store.removeItem('lechuga-batavia');
    expect(store.cart().some((item) => item.product.id === 'lechuga-batavia')).toBe(false);
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
});
