from http.server import BaseHTTPRequestHandler
from urllib.parse import unquote
import json
import io
import sys
import traceback

# NOTE: Rate limiting is handled at the Vercel infrastructure level.
# For additional protection, consider configuring Vercel's rate limiting
# settings in vercel.json or using Vercel Firewall rules.

try:
    import msoffcrypto
    HAS_MSOFFCRYPTO = True
except ImportError:
    HAS_MSOFFCRYPTO = False

ALLOWED_ORIGINS = [
    'https://davichi-finance-tool-ai2z.vercel.app',
    'http://localhost:5173',
]

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50MB
MAX_PASSWORD_LENGTH = 100


class handler(BaseHTTPRequestHandler):
    def _get_cors_origin(self):
        """Check the request Origin header and return it if allowed, otherwise None."""
        origin = self.headers.get('Origin', '')
        if origin in ALLOWED_ORIGINS:
            return origin
        return None

    def _set_cors_headers(self):
        """Set CORS headers based on the request Origin."""
        origin = self._get_cors_origin()
        if origin:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Vary', 'Origin')

    def _send_json_error(self, status_code, message):
        """Send a JSON error response with CORS headers."""
        body = json.dumps({'error': message}).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        try:
            if not HAS_MSOFFCRYPTO:
                self._send_json_error(500, '서버에 msoffcrypto 모듈이 설치되어 있지 않습니다.')
                return

            # Reject early if Content-Length is missing or oversized so we never
            # buffer a huge body.
            content_length_raw = self.headers.get('Content-Length')
            if not content_length_raw:
                self._send_json_error(411, 'Content-Length 헤더가 필요합니다.')
                return
            try:
                content_length = int(content_length_raw)
            except ValueError:
                self._send_json_error(400, '잘못된 Content-Length 값입니다.')
                return
            if content_length <= 0:
                self._send_json_error(400, '파일이 전송되지 않았습니다.')
                return
            if content_length > MAX_FILE_SIZE_BYTES:
                self._send_json_error(400, '파일 크기가 50MB를 초과합니다. 더 작은 파일을 업로드해주세요.')
                return

            # Password arrives in a header (URL-encoded so non-ASCII is safe).
            # Avoiding the body keeps the request a single binary blob without
            # multipart parsing.
            raw_password = self.headers.get('X-Password', '')
            try:
                password = unquote(raw_password)
            except Exception:
                self._send_json_error(400, '비밀번호 헤더 형식이 올바르지 않습니다.')
                return

            if len(password) > MAX_PASSWORD_LENGTH:
                self._send_json_error(400, f'비밀번호는 {MAX_PASSWORD_LENGTH}자 이하로 입력해주세요.')
                return

            file_bytes = self.rfile.read(content_length)
            encrypted_file = io.BytesIO(file_bytes)
            decrypted_file = io.BytesIO()

            office_file = msoffcrypto.OfficeFile(encrypted_file)
            office_file.load_key(password=password)
            office_file.decrypt(decrypted_file)

            decrypted_bytes = decrypted_file.getvalue()

            self.send_response(200)
            self.send_header('Content-Type', 'application/octet-stream')
            self.send_header('Content-Length', str(len(decrypted_bytes)))
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(decrypted_bytes)

        except msoffcrypto.exceptions.DecryptionError:
            self._send_json_error(401, '암호가 올바르지 않습니다. 다시 확인해주세요.')

        except Exception:
            # Log full trace server-side; return a generic message to the client
            # so internal paths/library details don't leak.
            traceback.print_exc(file=sys.stderr)
            self._send_json_error(500, '복호화 중 오류가 발생했습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Password')
        self.end_headers()
