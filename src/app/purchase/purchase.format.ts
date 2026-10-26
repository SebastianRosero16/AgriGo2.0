const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeStyle: 'short',
});

const deliveryDateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
});

export function formatCop(amount: number): string {
  return copFormatter.format(amount);
}

export function formatOrderDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDeliveryDate(value: string): string {
  return deliveryDateFormatter.format(new Date(`${value}T12:00:00`));
}
