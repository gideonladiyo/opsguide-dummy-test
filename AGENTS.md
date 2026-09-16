# AGENTS.md

## Tujuan repository

Repository ini adalah kumpulan bahan testcase untuk pengujian WebRPA. Fokus utama adalah testcase yang terisolasi, URL atau input yang stabil, dan fixture yang mudah dipakai ulang.

## Peta kode

- `index.html` dan `styles.css`: katalog root.
- `ratsk147/` dan `dummy-form/`: testcase yang sudah ada; keduanya bukan batasan struktur repository.
- Folder testcase baru sebaiknya menyimpan halaman, fixture, aset, dan test terkait secara mandiri.
- `api/submit.js`: adapter root untuk endpoint `dummy-form`; jangan menyalin logic implementasi ke sini.

## Instruksi kerja

- Baca `CONTRIBUTING.md` sebelum mengubah struktur, URL, atau integrasi spreadsheet.
- Utamakan perubahan sekecil mungkin dan gunakan pola yang sudah ada.
- Untuk perubahan API `dummy-form`, pertahankan validasi metadata, batas payload, dan format field spreadsheet kecuali tugas memang meminta perubahan kontrak.
- Untuk perubahan testcase, cek minimal satu jalur atau input yang terdampak dan tambahkan test bila perilakunya non-trivial.
- Jangan mengubah fixture CSV atau URL yang ada hanya demi merapikan struktur.
- Jangan menambahkan dependency tanpa kebutuhan yang jelas.

## Verifikasi

Jalankan dari root repository:

```powershell
npm test
```

Jika menguji submit end-to-end, gunakan `npx vercel dev` dengan `GOOGLE_SHEET_URL` yang disetel di environment lokal. Jangan menampilkan atau men-commit nilainya.
