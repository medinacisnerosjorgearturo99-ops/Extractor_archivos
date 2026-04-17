# Usamos una imagen ligera de Python
FROM python:3.9-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos todos los archivos del proyecto al contenedor
COPY . /app/

# Ejecutamos el script de Python (Cumple con el punto de ejecutar en instancia)
RUN python procesar.py

# Exponemos el puerto 80 para la página web
EXPOSE 80

# Levantamos un servidor web simple con Python para servir el index.html y resultado.txt
CMD ["python", "-m", "http.server", "80"]