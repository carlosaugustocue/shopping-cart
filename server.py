from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Agregar content type correcto para JavaScript
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        # Asegurar que el path comience con /
        if not self.path.startswith('/'):
            self.path = '/' + self.path
        return SimpleHTTPRequestHandler.do_GET(self)

def run():
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, CustomHandler)
    print(f'Servidor corriendo en http://localhost:{port}')
    httpd.serve_forever()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run()
