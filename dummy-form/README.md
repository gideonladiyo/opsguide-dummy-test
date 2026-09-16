# 100 Dummy Forms

Kumpulan 10 jenis form. Setiap jenis memiliki 10 duplikasi, sehingga tersedia 100 endpoint statis.

Pola URL:

```text
/dummy-form/{jenis}/{duplikasi}
```

Contoh:

```text
/dummy-form/1/2
```

URL tersebut membuka Form Kontak jenis 1, duplikasi 2. Nilai `jenis` dan `duplikasi` sama-sama berada pada rentang 1 sampai 10.

## Spreadsheet

Form memakai kembali koneksi Google Apps Script lama melalui environment variable `GOOGLE_SHEET_URL`. Setiap row membawa:

- `Source URL`, misalnya `http://localhost:3000/dummy-form/1/2/`
- `Source Path`, tipe form, nomor duplikasi, dan nama form
- seluruh nilai field dalam `Payload JSON`

Endpoint tetap mengisi kolom lama `Timestamp`, `Name`, `Email`, dan `Description`. Karena itu Apps Script lama masih bekerja dan URL sumber juga tertulis di `Description`.

Untuk mendapatkan kolom khusus `Source URL` sampai `Payload JSON`, copy isi `google-apps-script.gs` ke Apps Script spreadsheet lama, lalu deploy ulang Web App. Spreadsheet target lama:

<https://docs.google.com/spreadsheets/d/1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40/edit>

## Menjalankan di lokal

Jalankan dari root repository:

```powershell
Get-Content .\dummy-form\.env | ForEach-Object {
  if ($_ -match '^GOOGLE_SHEET_URL=(.+)$') { $env:GOOGLE_SHEET_URL = $Matches[1] }
}
npx vercel dev
```

Lalu buka URL yang ditampilkan Vercel, misalnya <http://localhost:3000/dummy-form/>.

`python -m http.server` hanya bisa menampilkan file statis dan tidak dapat menjalankan endpoint `/api/submit`, jadi submit spreadsheet tidak akan bekerja dengan server Python tersebut.

Pastikan `GOOGLE_SHEET_URL` juga sudah disetel pada Environment Variables project Vercel untuk deployment production.
