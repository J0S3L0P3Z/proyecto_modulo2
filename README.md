# Marketplace de Alojamientos - Inversiones LR

## 1. Descripción del proyecto

Aplicación web desarrollada para Inversiones LR que permite consultar alojamientos temporales, gestionar propiedades, realizar cotizaciones.

## 2. Integrantes

- Julio Esteban Hernandez Romero
- Jose David Lopez Granados
- Esteban Mogollón Escobar
- Andres Felipe Castro Garcia

## 3. Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap
- Font Awesome
- Animate.css
- JSON
- GitHub

## 4. APIs utilizadas

- API del clima.
- API de tasas de cambio de monedas.

## 5. Requisitos para ejecutar la aplicación

- Node.js.
- npm.
- Angular CLI.
- WebStorm.
- Navegador web.
- Conexión a internet para consultar las APIs externas.

## 6. Instrucciones de instalación

1. Descargar o clonar el repositorio desde GitHub.
2. Abrir la carpeta PROYECTOMODULODOS en WebStorm.
3. En la parte superior derecha de WebStorm, abrir el menú de configuraciones de ejecución mediante los tres puntos.
4. Seleccionar Edit Configurations.
5. Seleccionar la configuración install.
6. Ejecutar la configuración para instalar las dependencias del proyecto.

## 7. Instrucciones de ejecución

1. Abrir el proyecto en WebStorm.
2. Seleccionar la configuración Angular CLI Server.
3. Ejecutar ng serve.
4. Esperar a que termine la compilación.
5. Abrir el navegador e ingresar a:

   http://localhost:4200/

## 8. Principales funcionalidades

### Gestión de alojamientos
- Crear alojamientos.
- Consultar alojamientos disponibles.
- Actualizar alojamientos.
- Eliminar alojamientos.
- Filtrar alojamientos.
- Consultar detalles, imágenes, ubicación, características, servicios y reglas.

### Cotización de reservas
- Seleccionar fechas de llegada y salida.
- Seleccionar la cantidad de huéspedes.
- Calcular el número de noches.
- Calcular el subtotal del alojamiento.
- Calcular la tarifa de limpieza.
- Calcular la tarifa de servicio del 10 %.
- Calcular el total de la reserva.

### Gestión de reservas
- Crear reservas.
- Consultar reservas registradas.
- Actualizar reservas.
- Eliminar reservas.
- Consultar la información y el costo de las reservas.

### Reseñas de huéspedes
- Publicar reseñas.
- Asignar calificaciones.
- Registrar comentarios.
- Consultar reseñas de los alojamientos.

### Conversor de monedas
- Ingresar cantidades para convertir.
- Seleccionar la moneda de origen y destino.
- Convertir entre COP, USD y EUR.
- Consultar tasas de cambio mediante una API externa.

### Consulta del clima
- Consultar información meteorológica mediante una API externa.

## 9. Estructura general del proyecto


El proyecto está organizado en la carpeta principal PROYECTOMODULODOS, que contiene la carpeta src, donde se encuentra el código fuente de la aplicación Angular.

Dentro de src está la carpeta app, que contiene los componentes, las páginas, los servicios y los archivos principales de configuración de la aplicación, como app.module.ts y app-routing.module.ts`.

También se encuentran las carpetas assets y public, destinadas a los recursos e imágenes utilizados en el proyecto, junto con archivos como index.html, main.ts y styles.css.

En la raíz del proyecto están los archivos de configuración de Angular, las dependencias del proyecto (package.json) y el archivo README.md, que contiene la documentación del proyecto.

## 10. Repositorio de GitHub

https://github.com/J0S3L0P3Z/proyecto_modulo2/branches
