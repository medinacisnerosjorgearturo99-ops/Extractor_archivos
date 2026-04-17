from http.server import SimpleHTTPRequestHandler, HTTPServer

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Esto es la magia: permite que la web en S3 pida el resultado.txt a la EC2
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    print("Iniciando servidor web con CORS en el puerto 80...")
    # Escucha en todas las interfaces en el puerto 80
    httpd = HTTPServer(('0.0.0.0', 80), CORSRequestHandler)
    httpd.serve_forever()