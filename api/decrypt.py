from http.server import BaseHTTPRequestHandler
import json
import base64
import io

try:
    import msoffcrypto
    HAS_MSOFFCRYPTO = True
except ImportError:
    HAS_MSOFFCRYPTO = False


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            if not HAS_MSOFFCRYPTO:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '서버에 msoffcrypto 모듈이 설치되어 있지 않습니다.'}).encode())
                return

            file_b64 = data.get('file')
            password = data.get('password', '')

            if not file_b64:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '파일이 전송되지 않았습니다.'}).encode())
                return

            file_bytes = base64.b64decode(file_b64)
            encrypted_file = io.BytesIO(file_bytes)
            decrypted_file = io.BytesIO()

            office_file = msoffcrypto.OfficeFile(encrypted_file)
            office_file.load_key(password=password)
            office_file.decrypt(decrypted_file)

            decrypted_b64 = base64.b64encode(decrypted_file.getvalue()).decode('utf-8')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'file': decrypted_b64}).encode())

        except msoffcrypto.exceptions.DecryptionError:
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': '암호가 올바르지 않습니다. 다시 확인해주세요.'}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': f'복호화 중 오류가 발생했습니다: {str(e)}'}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
