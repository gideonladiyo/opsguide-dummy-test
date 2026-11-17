// Mengembalikan body JSON, bukan file PDF.
// Dipakai untuk menguji deteksi tipe konten salah di WebRPA.
export default function handler(request, response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Content-Disposition', 'attachment; filename="invoice-error.json"');
  response.end(JSON.stringify({
    error: 'INVOICE_UNAVAILABLE',
    message: 'Invoice could not be generated. Expected a PDF file but received JSON.',
    invoice: null,
  }));
}
