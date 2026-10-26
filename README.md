# AgriGo

AgriGo es un mercado digital agrícola que conecta a productores locales con personas interesadas en comprar sus productos. El proyecto busca ofrecer una experiencia sencilla para explorar productos del campo y gestionar publicaciones, aplicando los conceptos de Angular y TypeScript trabajados en la materia Electiva III.

## Alcance del proyecto

### Compradores

- Consultar el catálogo de productos agrícolas.
- Buscar productos y filtrarlos por categoría.
- Ver el detalle de un producto y la información básica de su productor.
- Agregar productos al carrito y ajustar cantidades.
- Simular un pedido y consultar su confirmación e historial.

### Productores

- Consultar sus productos publicados.
- Publicar, editar y eliminar productos.
- Gestionar información básica como nombre, descripción, categoría, precio, unidad y disponibilidad.

## Tecnologías y datos

- Angular y TypeScript para el frontend.
- Datos de ejemplo cargados como semilla.
- `localStorage` para conservar los cambios en el navegador durante la demostración.

La aplicación es un prototipo académico: no incluye pagos reales, base de datos, servicios backend ni funciones de inteligencia artificial. Los datos guardados en `localStorage` pertenecen al navegador y dispositivo donde se utiliza la aplicación.

## Ejecución

El proyecto Angular se encuentra en `book-angular-6b`. Requiere Node.js compatible con Angular 22 y npm:

```bash
cd book-angular-6b
npm install
npm start
```

Abre la dirección local que indique Angular CLI en la terminal. Para ejecutar las pruebas y generar una compilación:

```bash
npm test
npm run build
```

## Flujo de compra implementado

- El carrito permite aumentar o disminuir cantidades, quitar productos y consultar el subtotal.
- El checkout valida los datos de entrega y ofrece métodos de pago simulados; no solicita ni procesa datos bancarios.
- Al confirmar, se crea una orden de demostración, se vacía el carrito y se muestra la confirmación.
- El historial permite consultar las órdenes creadas en el navegador.

El catálogo inicial, los precios y el inventario son datos de ejemplo. El carrito y las órdenes se guardan en `localStorage`; cualquier persona con acceso al navegador puede modificar esos datos desde las herramientas de desarrollo. Esta aplicación no ofrece autenticación, autorización, pagos reales ni seguridad de inventario. Esas garantías requieren validación y persistencia en un backend confiable.

## Estado

Proyecto final de Electiva III en desarrollo.
