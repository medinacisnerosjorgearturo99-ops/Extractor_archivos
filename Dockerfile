FROM python:3.9-slim

WORKDIR /app

COPY . /app/

# Instalamos las dependencias
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

CMD ["python", "server.py"]