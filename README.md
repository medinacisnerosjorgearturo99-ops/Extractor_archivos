# DataViewer Pro & AWS Pipeline - Actividad 4

Este proyecto consiste en una aplicación web interactiva para el análisis de datos, acoplada a un flujo de integración y entrega continua (CI/CD) utilizando AWS y Docker.

## Características Principales
* **Procesamiento Backend:** Script en Python que analiza un archivo `Estados.txt` y genera un reporte `resultado.txt`.
* **Interfaz Web Avanzada:** Lector de archivos (`.csv`, `.json`, `.txt`) con inferencia automática de esquemas, búsqueda flexible, filtros y exportación a PDF. Modo Claro/Oscuro incluido.
* **DevOps Pipeline:** Configuración lista para AWS CodeBuild (`buildspec.yml`) y contenedorización con `Dockerfile` para despliegue en instancias EC2.

## Estructura del Proyecto
- `index.html`, `/css`, `/js`: Front-end de la aplicación web.
- `procesar.py`: Lógica de Python para el procesamiento de datos inicial.
- `Estados.txt`: Archivo de datos de entrada para el script.
- `Dockerfile`: Entorno aislado de Python para ejecutar el script y servir la web.
- `buildspec.yml`: Instrucciones de CI/CD para AWS.

## Ejecución Local con Docker
Para probar este proyecto en tu máquina de forma local usando contenedores:
1. Construir la imagen: `docker build -t actividad4-web .`
2. Correr el contenedor: `docker run -d -p 8080:80 --name visor-datos actividad4-web`
3. Abrir en el navegador: `http://localhost:8080`