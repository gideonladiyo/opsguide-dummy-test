# CACTAS submit failure forms

Katalog: `/cactas-submit/`
Halaman: `/cactas-submit/<slug>/` (30 halaman, lihat tabel di bawah)

Fixture untuk tiket kegagalan kirim CACTAS (~45%/hari sejak 10/31) dan sub-task-nya:

- **Grup A**: pencocokan tombol 送信/確認 tanpa bergantung pada teks persis (TLTSK-722).
- **Grup B**: click timeout dan tombol yang tidak terlihat (scope 2).
- **Grup C**: proxy fixed IP dan `ERR_TUNNEL_CONNECTION_FAILED` (TLTSK-721).

## Cara pakai

1. Upload `companies.csv` lewat **Upload CSV** (format sama dengan `dummy-form-urls.csv`). Untuk grup C, upload juga `tunnel-targets.csv`.
2. Generate skenario sampai berstatus Generated, lalu jalankan pengiriman.
3. Cek hasilnya di OpsGuide **dan** di halaman akhir (screenshot hasil step):
   - `thanks/` dengan badge hijau `OK: 送信ボタン (#submit-button)` = tombol yang benar terklik.
   - Badge merah `NG: 想定外の要素 (...)`, halaman `search/` (検索結果) atau `newsletter/` = elemen yang salah terklik. Jika OpsGuide mencatatnya sebagai sukses, itu **false success**.

### Mereproduksi error prod (`Could not find element … CSS: 送信する`)

Di prod, selector step submit berisi teks tombol, bukan CSS. Untuk meniru: setelah generate, edit step klik submit dan isi selector `送信する` (tipe CSS). Selector CSS `送信する` tidak pernah cocok di halaman mana pun (sudah dicek dengan Playwright, termasuk `a01-baseline`), jadi hasil step sepenuhnya ditentukan oleh fallback teks dan fallback `[type=submit]`.

### Teks tombol berubah setelah skenario dibuat (`a00-drift`)

`a00-drift` membaca label dan jenis tombol dari URL:

```text
/cactas-submit/a00-drift/?label=<teks>&type=<button|input|notype|anchor>
```

Generate skenario di `a00-drift/` (default `送信する`, `<button type="submit">`), lalu ubah URL step buka halaman, misalnya `?label=%E3%80%80%E9%80%81%E4%BF%A1%E3%81%99%E3%82%8B%E3%80%80` (`　送信する　`) atau `?label=送信する%20>&type=input`.

## Halaman

Hasil "setelah fix" di bawah adalah perkiraan dari spesifikasi tiket. Baris yang ditandai **konfirmasi dev** belum diatur oleh tiket.

### Grup A: teks tombol (TLTSK-722)

| Halaman | Tombol | Yang diharapkan setelah fix |
|---|---|---|
| `a00-drift` | dari query `label` / `type` | Lihat bagian di atas |
| `a01-baseline` | `<button type=submit>送信する` | Sukses (kontrol, harus sukses sebelum dan sesudah fix) |
| `a02-short` | `送信` | Sukses |
| `a03-long` | `この内容で送信する` | Sukses |
| `a04-zenkaku-space` | `　送信する　` (U+3000) | Sukses (normalisasi spasi lebar penuh) |
| `a05-arrow` | `送信する >` | Sukses (teks tambahan `>`) |
| `a06-zenkaku-arrow` | `送信する　＞` | Sukses (`＞` lebar penuh) |
| `a07-nested-br` | ikon + `送信<br>する` | Sukses |
| `a08-input-submit` | `<input type=submit value=" 送信する ">` | Sukses |
| `a09-button-notype` | `<button>送信する ></button>` tanpa `type` | **Konfirmasi dev**: HTML menganggapnya submit, tetapi `button[type=submit]` tidak cocok |
| `a10-spaced` | `送&nbsp;信&nbsp;す&nbsp;る` | **Konfirmasi dev**: tergantung spasi dibuang atau hanya dirapatkan |
| `a11-input-image` | `<input type=image alt="送信する">` | **Konfirmasi dev**: tidak ada di daftar fallback |
| `a12-anchor-only` | hanya `<a role=button>送信する` | Sukses lewat teks, atau gagal dengan "element not found". Tidak boleh false success |
| `a13-confirm-flow` | `確認画面へ進む ＞` → konfirmasi: `戻る` (type=submit, lebih dulu di DOM) lalu `　この内容で送信する　` | Sukses. Tidak boleh menekan `戻る` (kembali ke form input) |
| `a14-multi-form` | header `検索` (button submit pertama di DOM), form `送信する >`, footer `登録する` (input submit terakhir) | Harus sampai `thanks/`. Sampai `search/` atau `newsletter/` = bug |
| `a15-reset-first` | `type=reset` 「送信内容をクリア」 lalu `送信` | Tidak boleh menekan reset (teksnya juga mengandung 送信; isian akan terhapus) |
| `a16-form-attr` | tombol di luar `<form>`, `form="contact-form"` | Sukses jika fallback global; gagal jika fallback dibatasi `form button[type=submit]` |

### Grup B: click timeout / tombol tidak terlihat

Hasil Playwright `click()` biasa (dicek lokal, viewport 1280×800) menunjukkan penyebab yang direproduksi setiap halaman.

| Halaman | Kondisi | `click()` biasa | Yang diharapkan setelah fix |
|---|---|---|---|
| `b01-hidden-duplicate` | Dua tombol `送信する`; yang pertama di DOM versi SP (`display:none` di desktop) | Timeout (kena yang tersembunyi) | Memilih tombol yang terlihat → sukses |
| `b02-cookie-modal` | Modal Cookie menutupi layar sampai `同意する` | Timeout (pointer intercepted) | **Konfirmasi dev**: modal ditutup/diabaikan, atau error yang jelas |
| `b03-loading-overlay` | Overlay transparan 8 detik setelah load | Timeout jika batas < 8 dtk; sukses jika menunggu | Sukses |
| `b04-late-button` | Tombol masuk DOM 6 detik setelah load | Sama seperti b03 | Sukses |
| `b05-late-button-long` | Tombol masuk DOM 45 detik setelah load | Timeout | Gagal dengan pesan timeout yang jelas, tidak hang (kontrol negatif) |
| `b06-agree-reveal` | Tombol `hidden` sampai checkbox 同意 dicentang | Timeout tanpa centang | Sukses jika skenario mencentang 同意; catat jika step centang tidak dibuat |
| `b07-agree-disabled` | Tombol `disabled` sampai checkbox 同意 dicentang | Timeout tanpa centang | Sama seperti b06 |
| `b08-label-proxy` | `<input type=submit>` `display:none`, yang terlihat `<label for>` | Timeout pada input; label bisa diklik | **Konfirmasi dev** |
| `b09-chat-bar-cover` | Bar chat `position:fixed` di bawah menutupi tombol di akhir halaman | Timeout (pointer intercepted) | **Konfirmasi dev** |
| `b10-animated-button` | Tombol beranimasi terus | Timeout (tidak pernah stable) | **Konfirmasi dev** |
| `b11-shadow-dom` | Form di dalam open shadow root | CSS sukses, XPath gagal | Sukses (catat jenis selector yang dipakai) |
| `b12-scroll-container` | Tombol di container `overflow:auto` | Sukses | Sukses (kontrol positif) |

Jika fix memakai klik JS / `force`, cek badge di `thanks/`: di `b01`, `btn=submit-button-sp` berarti tombol tersembunyi yang terklik (form tetap terkirim).

### Grup C: proxy fixed IP (TLTSK-721)

| Target | Cara | Yang diharapkan |
|---|---|---|
| `c01-whoami` | Halaman menampilkan `アクセス元IP` saat load, dan `thanks/` menampilkannya lagi setelah submit | Dengan fixed IP: IP = Elastic IP proxy. Setelah retry, IP tetap IP proxy (retry tidak boleh lewat koneksi langsung) |
| C02 (`tunnel-targets.csv`) | `https://opsguide-dummy-test.vercel.app:8443/...`; squid menolak `CONNECT` ke port selain 443 (`http_access deny CONNECT !SSL_ports`) | `ERR_TUNNEL_CONNECTION_FAILED` yang selalu terjadi: retry sebanyak batas yang ditentukan dev, lalu failed dengan error tunnel. Tanpa fixed IP error-nya lain (timeout/refused) |
| C03 (`tunnel-targets.csv`) | Host yang tidak ada (`.example`); DNS squid gagal → 503 | `ERR_TUNNEL_CONNECTION_FAILED` lewat proxy; `ERR_NAME_NOT_RESOLVED` tanpa proxy |

Kegagalan tunnel yang sementara (gagal sekali lalu pulih) tidak bisa dibuat dari halaman statis dan perlu bantuan infra, misalnya restart squid atau instance refresh ASG saat batch berjalan.

Log server: setiap load `c01-whoami` dan `thanks/` memanggil `/api/cactas-whoami` yang mencatat `[cactas-whoami] {ts, ip, page, event, btn, ua}` di log function Vercel. Pakai log ini untuk mengecek IP pengirim dan kiriman ganda (`event=submit` lebih dari satu untuk satu run).

### Prasyarat di dev (TLTSK-730 / TLTSK-737)

Di luar prod, batch form automation memakai guard domain, dan user squid khusus form automation hanya boleh `CONNECT` ke domain di SSM `/<env>/<service>/form-submit-guard/allowed-domains` (disinkronkan ke squid setiap 5 menit). Tambahkan `opsguide-dummy-test.vercel.app` ke daftar itu sebelum testing. Jika tidak, semua run lewat proxy ditolak squid (403, terlihat sebagai `ERR_TUNNEL_CONNECTION_FAILED`) atau di-BLOCK guard.

## Perilaku halaman

- Validasi hanya di browser (field wajib). Tidak ada data yang disimpan; `thanks/` hanya menampilkan `page`, `btn`, dan `label` dari URL.
- Selector tetap: form `#contact-form`, tombol kirim yang benar `#submit-button`, status `#form-status`.
- `python -m http.server` cukup untuk tampilan; `/api/cactas-whoami` hanya berjalan di Vercel (`npx vercel dev` atau deployment).

## Test

`npm test` dari root menjalankan `cactas-submit/pages.test.js`: setiap URL di `companies.csv` punya halaman dengan form dan `#submit-button`, dan handler whoami mengembalikan IP pertama dari `x-forwarded-for`.
