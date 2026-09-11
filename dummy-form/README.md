# Hikidasu Inquiry Contact Form - Google Sheet & Vercel Integration

Form kontak ini didesain persis mengikuti bahasa, teks, dan struktur HTML dari halaman inquiry **Hikidasu (Japan Foundation)**:
[https://www.hikidasu.jpf.go.jp/en/inquiry/](https://www.hikidasu.jpf.go.jp/en/inquiry/)

**Google Sheet Target**: [https://docs.google.com/spreadsheets/d/1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40/edit](https://docs.google.com/spreadsheets/d/1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40/edit)

---

## 🚀 Panduan 1 Menit Menghubungkan Google Sheet Anda

Agar web form dapat mengirimkan isian langsung ke Google Sheet di atas, Google memerlukan **Web App Script Endpoint**. Berikut langkah singkatnya:

### Langkah 1: Buka Apps Script dari Google Sheet
1. Buka spreadsheet Anda: [https://docs.google.com/spreadsheets/d/1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40/edit](https://docs.google.com/spreadsheets/d/1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40/edit)
2. Pastikan di **Baris 1 (Header)** sheet sudah ada judul kolom:
   - Kolom A: `Timestamp`
   - Kolom B: `Name`
   - Kolom C: `Email`
   - Kolom D: `Description`
3. Klik menu **Extensions (Ekstensi)** > **Apps Script**.

### Langkah 2: Copy-Paste Kode Berikut
Hapus semua kode yang ada di layar editor Apps Script, lalu **Paste** kode di bawah ini:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('1ZErDpahDTphX251eHncQvUhsZYyaTfL3qmuZepzOM40');
    var sheet = ss.getActiveSheet();
    
    var timestamp = new Date();
    var name = "";
    var email = "";
    var description = "";

    if (e.parameter) {
      name = e.parameter.name || "";
      email = e.parameter.email || "";
      description = e.parameter.description || "";
      if (e.parameter.timestamp) {
        timestamp = e.parameter.timestamp;
      }
    }

    sheet.appendRow([timestamp, name, email, description]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Data successfully recorded" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Langkah 3: Deploy sebagai Web App
1. Klik tombol **Deploy** (pojok kanan atas) > **New deployment**.
2. Klik ikon gerigi ⚙️ (Select type) > pilih **Web app**.
3. Atur pengaturannya:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Wajib pilih Anyone)*
4. Klik **Deploy** > Beri izin akses (*Authorize Access*) > **Copy Web App URL**.
   - (Format URL: `https://script.google.com/macros/s/.../exec`)

---

## ⚡ 2 Cara Mengaktifkan URL di Website:

1. **Di Vercel (Rekomendasi)**: Masuk ke project Vercel Anda > **Settings** > **Environment Variables** > Buat Variable `GOOGLE_SHEET_URL` dan paste Web App URL tersebut.
2. **Langsung di Website**: Buka halaman `index.html` > Paste Web App URL pada bar **Google Sheet Endpoint Setup** di bagian atas > Klik **Save Endpoint**.
