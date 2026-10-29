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

export function formatOrderReference(id: string): string {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }

  const reference = id.replaceAll('-', '').slice(0, 16).toUpperCase();
  return `AG-${reference.slice(0, 8)}-${reference.slice(8)}`;
}

export function formatDeliveryDate(value: string): string {
  return deliveryDateFormatter.format(new Date(`${value}T12:00:00`));
}
