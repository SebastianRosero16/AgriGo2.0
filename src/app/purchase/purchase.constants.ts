export const CART_STORAGE_KEY = 'agrigo.purchase.cart.v2';
export const ORDERS_STORAGE_KEY = 'agrigo.purchase.orders.v2';
export const SHIPPING_COST = 0;
export const MAX_QUANTITY_PER_PRODUCT = 99;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo contraentrega' },
  { value: 'bank-transfer', label: 'Transferencia bancaria' },
] as const;

export const DELIVERY_WINDOWS = [
  { value: 'morning', label: 'Mañana (8:00 a. m. – 12:00 m.)' },
  { value: 'afternoon', label: 'Tarde (12:00 m. – 6:00 p. m.)' },
  { value: 'evening', label: 'Noche (6:00 p. m. – 9:00 p. m.)' },
] as const;
