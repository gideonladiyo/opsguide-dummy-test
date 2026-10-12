# Dummy Invoices

Fixture invoice dummy untuk pengujian ekstraksi dan download file PDF.

## Endpoint

### Halaman invoice

Semua halaman berisi konten yang sama, hanya URL yang berbeda:

- `/dummy-inv/`
- `/dummy-inv/receipt/`
- `/dummy-inv/download/`
- `/dummy-inv/billing/`
- `/dummy-inv/invoice/`

Setiap halaman punya satu tombol download yang menunjuk ke file PDF yang sama.

### Halaman decoy (rejected)

URL yang harus ditolak `sanitize_invoice_url`. Bukan halaman invoice, tanpa tombol download, dan tidak memuat `script.js`:

- `/dummy-inv/social/` — meniru feed media sosial
- `/dummy-inv/login/` — halaman sign-in palsu
- `/dummy-inv/privacy/` — Privacy Policy
- `/dummy-inv/terms/` — Terms of Service

### Endpoint PDF

URL `.pdf` yang langsung menunjuk file PDF mentah.

Valid — target "URL invoice valid berakhiran .pdf":

- `/dummy-inv/invoice-dummy.pdf`
- `/dummy-inv/receipt.pdf`
- `/dummy-inv/download.pdf`
- `/dummy-inv/billing.pdf`
- `/dummy-inv/invoice.pdf`

Rejected — PDF yang harus ditolak:

- `/dummy-inv/invoice-expired.pdf`
- `/dummy-inv/invoice-fake.pdf`
- `/dummy-inv/invoice-empty.pdf`

## Valid vs rejected (test sanitize URL)

Klasifikasi URL untuk menguji `sanitize_invoice_url` — memilih URL invoice yang benar dari badan email yang berisi banyak decoy.

| Status | URL |
| --- | --- |
| Valid (halaman) | `/dummy-inv/`, `receipt/`, `download/`, `billing/`, `invoice/` |
| Valid (`.pdf`) | `invoice-dummy.pdf`, `receipt.pdf`, `download.pdf`, `billing.pdf`, `invoice.pdf` |
| Rejected (halaman) | `social/`, `login/`, `privacy/`, `terms/` |
| Rejected (`.pdf`) | `invoice-expired.pdf`, `invoice-fake.pdf`, `invoice-empty.pdf` |
| Invalid | path 404 mana pun |

> Catatan: `invoice.pdf` (valid) beririsan dengan `invoice-fake.pdf`, `invoice-empty.pdf`, dan `invoice-expired.pdf` (rejected) karena sama-sama mengandung `invoice` dan berakhiran `.pdf`. Test author harus memilih URL secara eksplisit, bukan sekadar "mengandung invoice".

### Pemetaan checklist email

| # | Isi badan email | Endpoint |
| --- | --- | --- |
| 1 | social media → invoice valid | `social/` + halaman invoice / `receipt.pdf` |
| 2 | login → invoice valid | `login/` + halaman invoice |
| 3 | invalid → URL `.pdf` valid | 404 + `invoice-dummy.pdf` / `invoice.pdf` |
| 4 | social → login → billing | `social/` + `login/` + `billing/` |
| 5 | invoice valid → Privacy Policy | halaman invoice + `privacy/` |
| 6 | hanya social + privacy + ToS | `social/` + `privacy/` + `terms/` (negatif) |
| 7 | hanya rejected (login + social) | `login/` + `social/` (negatif) |
| 8 | rejected → URL `receipt` | decoy + `receipt/` atau `receipt.pdf` |
| 9 | rejected → URL `download` | decoy + `download/` atau `download.pdf` |
| 10 | wrapped/redirect yang bisa dipulihkan | `?redirect=X` (mis. `invoice/?redirect=receipt`) |
| 11 | rejected → URL `billing` | decoy + `billing/` atau `billing.pdf` |
| 12 | rejected → URL `invoice` | decoy + `invoice/` atau `invoice.pdf` |

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
- `receipt.pdf`, `download.pdf`, `billing.pdf`, `invoice.pdf` — salinan `invoice-dummy.pdf`; URL `.pdf` valid yang mengandung tiap keyword untuk test sanitize.
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
