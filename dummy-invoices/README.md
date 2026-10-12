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

## Fixture

- `invoice-dummy.pdf` — PDF valid 1 halaman berisi invoice dummy (nomor, tanggal, item, total fiktif). Seluruh data bersifat fiktif.
- Selector tombol: `#download-invoice` atau `.pdf-download`
- Download memakai atribut `download="invoice-dummy.pdf"`, jadi file terunduh dengan nama tersebut tanpa membuka tab baru.

## Menjalankan

Halaman statis, tanpa API. Dari root repository:

```bash
python3 -m http.server 3000
```

Buka <http://localhost:3000/dummy-invoices/>.

Untuk menguji unduhan via WebRPA, gunakan URL endpoint di atas sebagai target.
