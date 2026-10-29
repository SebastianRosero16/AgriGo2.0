export interface Product {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly unit: string;
  readonly stock: number;
  readonly producer: string;
  readonly location: string;
  readonly imageUrl: string;
}
