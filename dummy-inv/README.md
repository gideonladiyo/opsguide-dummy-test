# Dummy Invoices

Fixture invoice dummy untuk pengujian ekstraksi dan download file PDF.

## Endpoint

Semua halaman berisi konten yang sama, hanya URL yang berbeda:

- `/dummy-inv/`
- `/dummy-inv/receipt/`
- `/dummy-inv/download/`
- `/dummy-inv/billing/`
- `/dummy-inv/invoice/`

Setiap halaman punya satu tombol download yang menunjuk ke file PDF yang sama.

## Varian

Tambahkan query parameter ke URL mana pun untuk memicu perilaku berbeda.

### `?delay=N`

Tombol disembunyikan, countdown N detik, lalu download PDF otomatis tanpa klik. `N` dibatasi 1–60; nilai di luar rentang atau non-integer diabaikan.

```text
/dummy-inv/receipt/?delay=3
```

### `?redirect=X`

Saat tombol diklik, PDF tetap terunduh lalu halaman redirect ke `/dummy-inv/X/`. Nilai `X` dibatasi ke `receipt`, `download`, `billing`, `invoice`. Nilai lain (termasuk URL eksternal atau path traversal) diabaikan.

```text
/dummy-inv/invoice/?redirect=receipt
```

### `?cookie_banner=1`

Banner cookie muncul di bagian bawah layar dan menutupi area tombol. RPA harus mengklik `#cookie-accept` untuk membuka akses download.

```text
/dummy-inv/receipt/?cookie_banner=1
```

### `?pin_gate=1`

Gerbang PIN mengunci tombol download. PIN benar: `1234`. PIN salah menampilkan `#pin-error` berisi "PIN salah" dan tombol tetap terkunci.

```text
/dummy-inv/billing/?pin_gate=1
```

### `?selector=v2`

Tombol memakai selector alternatif `#dl-invoice-v2` dengan kelas `.pdf-download-alt`, bukan `#download-invoice` / `.pdf-download`. Dipakai untuk menguji selector fallback.

```text
/dummy-inv/download/?selector=v2
```

### `?file=html`

Download menghasilkan file berekstensi `.pdf` tetapi isinya HTML — bukan PDF valid. Untuk menguji deteksi tipe file.

```text
/dummy-inv/?file=html
```

### `?file=empty`

Download menghasilkan file 0 byte.

```text
/dummy-inv/?file=empty
```

### `?file=expired`

Download menghasilkan PDF invoice yang berstatus kedaluwarsa.

```text
/dummy-inv/?file=expired
```

### `?file=json`

Tombol menunjuk ke `/api/invoice-json`, yang mengembalikan body JSON dengan `Content-Disposition: attachment`, bukan file PDF. **Butuh server.**

```text
/dummy-inv/?file=json
```

### `?file=error500`

Tombol menunjuk ke `/api/invoice-error`, yang selalu mengembalikan HTTP 500. **Butuh server.**

```text
/dummy-inv/?file=error500
```

### Kombinasi

Semua param dapat digabung.

```text
/dummy-inv/billing/?delay=2&redirect=download
/dummy-inv/?pin_gate=1&delay=5        ← countdown jalan setelah PIN benar
/dummy-inv/?selector=v2&file=expired
```

## Fixture

- `invoice-dummy.pdf` — PDF valid 1 halaman berisi invoice dummy (nomor, tanggal, item, total fiktif). Seluruh data bersifat fiktif.
- `invoice-expired.pdf` — PDF valid 1 halaman berisi invoice berstatus kedaluwarsa.
- `invoice-fake.pdf` — file berekstensi `.pdf` tetapi isinya HTML, bukan PDF.
- `invoice-empty.pdf` — file 0 byte.
- `script.js` — membaca query parameter, menjalankan varian, dan merender panel dokumen param di setiap halaman.
- `api/invoice-error.js` — serverless, selalu return HTTP 500.
- `api/invoice-json.js` — serverless, return body JSON dengan `Content-Disposition: attachment`.
- Selector tombol: `#download-invoice` atau `.pdf-download`
- Selector tombol varian v2: `#dl-invoice-v2` atau `.pdf-download-alt`
- Selector status countdown: `#download-status`
- Selector banner cookie: `#cookie-banner` dan `#cookie-accept`
- Selector gerbang PIN: `#pin-gate`, `#pin-input`, `#pin-submit`, `#pin-error`
- Selector panel dokumen: `#param-docs`, `#param-docs-list`, `#param-docs-note`

## Menjalankan

Sebagian besar varian adalah halaman statis dan bisa dijalankan dengan server sederhana:

```bash
python3 -m http.server 3000
```

Buka <http://localhost:3000/dummy-inv/>.

Dua varian — `?file=json` dan `?file=error500` — bergantung pada serverless function di root `api/`. Keduanya hanya jalan lewat Vercel, bukan server statis:

```bash
npx vercel dev
```

Buka URL yang ditampilkan Vercel, misalnya <http://localhost:3000/dummy-inv/?file=json>.

Untuk menguji unduhan via WebRPA, gunakan URL endpoint di atas sebagai target.
