export const PURCHASE_MESSAGES = {
  checkout: {
    orderCreation: {
      rollback:
        'No se pudo completar la compra de forma segura. Revisa “Mis pedidos” antes de volver a intentarlo para evitar duplicar la orden.',
      persistence:
        'No fue posible guardar el pedido en este navegador. El carrito se conserva; revisa el espacio disponible e inténtalo de nuevo.',
      'empty-cart': 'El carrito está vacío. Agrega productos antes de confirmar el pedido.',
    },
  },
  orders: {
    unavailableDeliveryWindow: 'Horario por confirmar',
  },
  orderConfirmation: {
    unspecifiedValue: 'No especificado',
  },
  storage: {
    demoCartUnavailable: 'No fue posible cargar los productos de ejemplo en este navegador.',
    orderRollbackFailed:
      'No se pudo completar la compra ni revertir el historial. Revisa tus pedidos antes de volver a intentarlo.',
    invalidCart: 'El carrito guardado no era válido; se cargó el carrito de ejemplo.',
    invalidOrders: 'El historial guardado no era válido; se inició un historial vacío.',
    readFailed: 'No fue posible leer los datos guardados en este navegador.',
    saveFailed: 'Los cambios se conservarán solo mientras esta pestaña permanezca abierta.',
  },
} as const;
