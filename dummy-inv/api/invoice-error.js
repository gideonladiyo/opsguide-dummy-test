// Simulasi kegagalan server: mengembalikan HTTP 500.
// Dipakai untuk menguji deteksi error HTTP di WebRPA.
export default function handler(request, response) {
  response.statusCode = 500;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Simulated server failure. This endpoint always returns HTTP 500.',
    status: 500,
  }));
}
