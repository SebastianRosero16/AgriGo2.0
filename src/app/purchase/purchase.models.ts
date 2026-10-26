export type PaymentMethod = 'cash' | 'bank-transfer';
export type DeliveryWindow = 'morning' | 'afternoon' | 'evening';
export type OrderStatus = 'confirmed';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly unit: string;
  readonly available: number;
  readonly producer: string;
  readonly location: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}

export interface ShippingDetails {
  readonly fullName: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly department: string;
  readonly postalCode: string;
  readonly deliveryDate: string;
  readonly deliveryWindow: DeliveryWindow;
  readonly instructions: string;
  readonly paymentMethod: PaymentMethod;
}

export interface PurchaseOrder {
  readonly id: string;
  readonly createdAt: string;
  readonly status: OrderStatus;
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
  readonly shippingDetails: ShippingDetails;
}

export type PlaceOrderInput = ShippingDetails;

export type OrderCreationResult =
  | { readonly success: true; readonly order: PurchaseOrder }
  | {
      readonly success: false;
      readonly reason: 'empty-cart' | 'persistence' | 'rollback';
    };
