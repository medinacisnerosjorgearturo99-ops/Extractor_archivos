FROM python:3.9-slim

WORKDIR /app

COPY . /app/

# Exponemos el puerto para la web
EXPOSE 80

# Levantamos el servidor con los permisos de CORS
CMD ["python", "server.py"]