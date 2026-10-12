# Dummy Invoices

Fixture invoice dummy untuk pengujian ekstraksi dan download file PDF.

## Endpoint

Semua halaman berisi konten yang sama, hanya URL yang berbeda:

- `/dummy-invoices/`
- `/dummy-invoices/receipt/`
- `/dummy-invoices/download/`
- `/dummy-invoices/billing/`
- `/dummy-invoices/invoice/`

Setiap halaman punya satu tombol download yang menunjuk ke file PDF yang sama.

## Varian

Tambahkan query parameter ke URL mana pun untuk memicu perilaku berbeda.

### `?delay=N`

Tombol disembunyikan, countdown N detik, lalu download PDF otomatis tanpa klik. `N` dibatasi 1–60; nilai di luar rentang atau non-integer diabaikan.

```text
/dummy-invoices/receipt/?delay=3
```

### `?redirect=X`

Saat tombol diklik, PDF tetap terunduh lalu halaman redirect ke `/dummy-invoices/X/`. Nilai `X` dibatasi ke `receipt`, `download`, `billing`, `invoice`. Nilai lain (termasuk URL eksternal atau path traversal) diabaikan.

```text
/dummy-invoices/invoice/?redirect=receipt
```

### Kombinasi

`?delay=N&redirect=X` → countdown N detik, download otomatis, lalu redirect.

```text
/dummy-invoices/billing/?delay=2&redirect=download
```

## Fixture

- `invoice-dummy.pdf` — PDF valid 1 halaman berisi invoice dummy (nomor, tanggal, item, total fiktif). Seluruh data bersifat fiktif.
- `script.js` — membaca query parameter dan menjalankan varian.
- Selector tombol: `#download-invoice` atau `.pdf-download`
- Selector status countdown: `#download-status`
- Download memakai atribut `download="invoice-dummy.pdf"`, jadi file terunduh dengan nama tersebut tanpa membuka tab baru.

## Menjalankan

Halaman statis, tanpa API. Dari root repository:

```bash
python3 -m http.server 3000
```

Buka <http://localhost:3000/dummy-invoices/>.

Untuk menguji unduhan via WebRPA, gunakan URL endpoint di atas sebagai target.
