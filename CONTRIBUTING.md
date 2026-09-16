# Contributing

Repository ini berisi bahan testcase untuk pengujian WebRPA. Setiap testcase dapat memiliki folder, aset, dan instruksi sendiri. Perubahan sebaiknya tetap kecil, mudah diuji, dan tidak merusak testcase atau URL yang sudah dipakai.

## Struktur penting

- `index.html` — katalog testcase yang tersedia saat ini.
- `ratsk147/` — salah satu testcase, untuk applicant CSV.
- `dummy-form/` — salah satu testcase, berisi 100 form.
- `api/submit.js` — adapter Vercel di root untuk endpoint submit milik `dummy-form`; hanya me-export implementasi dari `dummy-form/api/submit.js`.

Folder testcase baru sebaiknya mandiri: simpan halaman, fixture, aset, dan test yang hanya berkaitan dengannya di dalam folder tersebut. Tambahkan link atau keterangan di katalog root bila testcase perlu ditemukan dari halaman utama.

## Mulai bekerja

1. Clone repository dan buat branch dari branch default.
2. Untuk testcase yang sudah ada, edit file di folder testcase tersebut.
3. Untuk testcase baru, buat folder terpisah dan sertakan instruksi singkat bila cara menjalankan atau dependensinya berbeda.
4. Jika mengubah submit `dummy-form`, edit `dummy-form/api/submit.js` dan test di folder yang sama.
5. Jangan membuat implementasi API kedua di `api/submit.js`; file itu adapter khusus deployment root saat ini.

## Menjalankan dan menguji

Jalankan test dari root:

```powershell
npm test
```

Untuk mencoba form sekaligus endpoint secara lokal, siapkan `GOOGLE_SHEET_URL` lalu jalankan:

```powershell
npx vercel dev
```

Buka `/dummy-form/1/1/` dan pastikan submit berhasil. `python -m http.server` hanya cocok untuk tampilan statis dan tidak menjalankan `/api/submit`.

## Aturan perubahan

- Pertahankan URL testcase yang sudah ada. Aturan URL baru ditentukan oleh testcase tersebut dan harus didokumentasikan.
- Jangan memasukkan secret, URL privat, atau file `.env` ke commit.
- Jika mengubah integrasi atau format data testcase, perbarui semua sisi yang terkait dan dokumentasinya secara bersamaan.
- Jalankan test yang relevan; `npm test` wajib lulus bila perubahan menyentuh test atau kode yang dicakup script tersebut.
- Jelaskan skenario yang diuji dan perubahan perilaku pada deskripsi pull request.

## Pull request

Gunakan judul yang spesifik, sertakan alasan perubahan, file yang disentuh, dan hasil test. Perubahan visual sebaiknya menyertakan URL atau screenshot halaman yang relevan.
