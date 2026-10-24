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

La aplicación AgriGo se encuentra en `frontend`. Para ejecutarla:
Se requiere Node.js 24.15 o superior.

```bash
cd frontend
npm install
npm start
```

Luego, abre la dirección local que indique Angular CLI en la terminal.

## Estado

Proyecto final de Electiva III en desarrollo.