export type PaymentMethod = 'cash' | 'bank-transfer';
export type DeliveryWindow = 'morning' | 'afternoon' | 'evening';
export type OrderStatus = 'confirmed';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  available: number;
  producer: string;
  location: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
  deliveryDate: string;
  deliveryWindow: DeliveryWindow;
  instructions: string;
  paymentMethod: PaymentMethod;
}

export interface PurchaseOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingDetails: ShippingDetails;
}

export type PlaceOrderInput = ShippingDetails;
