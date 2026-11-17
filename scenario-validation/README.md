# Scenario validation forms

Katalog: `/scenario-validation/`  
Halaman: `/scenario-validation/good-01/` … `good-06/`, `/scenario-validation/bad-01/`, `bad-02/`

Delapan halaman form statis, masing-masing berperan sebagai satu perusahaan baru untuk menguji generate skenario dan **Validate Scenario** di OpsGuide (tiket TLBUG-34).

| Halaman | Isi form | Hasil validasi yang diharapkan |
|---|---|---|
| `good-01` … `good-06` | 5–6 field + tombol `送信する` | Good Generation (≥ 5 step dan klik tombol kirim di 5 step terakhir) |
| `bad-01`, `bad-02` | 1 field + tombol `送信する` | Bad Generation (kurang dari 5 step) |

Hasil di atas adalah perkiraan: jumlah step ditentukan oleh AI yang membuat skenario.

## Cara pakai

1. Upload `companies.csv` (format sama dengan `dummy-form-urls.csv`: `name,main_company_url,inquiry_url`) ke OpsGuide lewat **Upload CSV**.
2. Generate skenario untuk perusahaan-perusahaan itu, tunggu sampai berstatus Generated, lalu jalankan **Validate Scenario** untuk organisasinya.

## Perilaku halaman

- Submit hanya divalidasi di sisi browser (field wajib), lalu panel `#thanks` ditampilkan. Tidak ada request ke API atau spreadsheet.
- Selector tetap: form `#contact-form`, tombol `#submit-button`, status `#form-status`, panel selesai `#thanks`.

## Test

`npm test` dari root menjalankan `scenario-validation/pages.test.js`, yang memastikan setiap URL di `companies.csv` punya halaman dengan form dan tombol submit.
