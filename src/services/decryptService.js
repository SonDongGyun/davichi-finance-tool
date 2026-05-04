import * as XLSX from 'xlsx';
import { parseWorkbook } from '../utils/excel/parser';

// Sends the file as a raw binary body and the password in an X-Password header
// (URL-encoded so non-ASCII passwords are header-safe). This avoids the
// 1.33x base64 inflation that previously doubled memory usage on large files.
export async function decryptAndParse(file, password) {
  const arrayBuffer = await file.arrayBuffer();

  const res = await fetch('/api/decrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Password': encodeURIComponent(password),
    },
    body: arrayBuffer,
  });

  const contentType = res.headers.get('Content-Type') || '';

  // Server returns JSON only on errors. Octet-stream means success.
  if (contentType.includes('application/json')) {
    let message = '복호화에 실패했습니다.';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // Fall back to status-derived message below.
    }
    if (res.status === 413) message = '파일 크기가 너무 큽니다. 더 작은 파일을 업로드해주세요.';
    throw new Error(message);
  }

  if (!res.ok) {
    throw new Error(`서버 오류가 발생했습니다. (${res.status})`);
  }

  const decryptedBuffer = await res.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(decryptedBuffer), { type: 'array' });
  return parseWorkbook(workbook);
}
