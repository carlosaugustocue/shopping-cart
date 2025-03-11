# Shopping Cart

## Descripción
Este proyecto es una aplicación web que simula un carrito de compras. Permite a los usuarios agregar productos, ver detalles y gestionar su compra de manera sencilla e intuitiva. 

## Características principales
- Agregar productos al carrito.
- Visualizar productos disponibles.
- Ajustar la cantidad de productos en el carrito.
- Cálculo automático del precio total.
- Interfaz responsiva basada en Bootstrap.

## Tecnologías utilizadas
- **HTML5** y **CSS3** para la estructura y estilos.
- **Bootstrap** para el diseño responsivo.
- **JavaScript** para la interactividad.
- **Python (Flask o SimpleHTTPServer)** para servir la aplicación localmente.

## Instalación y configuración
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/carlosaugustocue/shopping-cart.git
   ```
2. Acceder al directorio del proyecto:
   ```bash
   cd shopping-cart
   ```
3. Instalar dependencias (si se requiere un servidor Flask):
   ```bash
   pip install flask
   ```
4. Ejecutar el servidor local:
   ```bash
   python server.py
   ```
5. Abrir el navegador y acceder a `http://localhost:5000`.

## Uso
1. Navega a la página principal.
2. Explora los productos disponibles.
3. Agrega productos al carrito de compras.
4. Ajusta las cantidades y revisa el precio total.
5. Procede con la compra.

## Archivos y estructura
```
shopping-cart/
│-- index.html      # Página principal
│-- css/
│   │-- style.css    # Estilos personalizados
│   │-- bootstrap.min.css  # Framework CSS
│-- js/
│   │-- scripts.js   # Lógica del carrito de compras
│-- images/          # Carpeta con imágenes de los productos
│-- server.py        # Servidor Python opcional
│-- README.md        # Documentación del proyecto
```

## Mejoras futuras
- Implementación de autenticación de usuarios.
- Integración con bases de datos para gestionar productos.
- Pasarelas de pago.

## Contribución
Si deseas contribuir, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`feature-nueva-funcionalidad`).
3. Realiza cambios y confírmalos (`git commit -m "Añadir nueva funcionalidad"`).
4. Sube los cambios (`git push origin feature-nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está bajo la licencia MIT. Puedes ver más detalles en el archivo `LICENSE`.
