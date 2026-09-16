const FORM_TYPES = [
  {
    name: 'Form Kontak',
    description: 'Pertanyaan umum dan permintaan informasi.',
    fields: [
      ['text', 'full_name', 'Nama lengkap', true],
      ['email', 'email', 'Email', true],
      ['select', 'subject', 'Topik', true, ['Informasi produk', 'Kerja sama', 'Media', 'Lainnya']],
      ['textarea', 'message', 'Pesan', true]
    ]
  },
  {
    name: 'Registrasi Acara',
    description: 'Pendaftaran peserta untuk sesi acara.',
    fields: [
      ['text', 'participant_name', 'Nama peserta', true],
      ['email', 'work_email', 'Email kerja', true],
      ['text', 'organization', 'Organisasi', false],
      ['select', 'session', 'Pilihan sesi', true, ['Sesi pagi', 'Sesi siang', 'Sesi sore']],
      ['radio', 'attendance', 'Kehadiran', true, ['Di lokasi', 'Online']],
      ['checkbox', 'event_consent', 'Saya menyetujui ketentuan acara', true]
    ]
  },
  {
    name: 'Lamaran Kerja',
    description: 'Pengumpulan data kandidat dan berkas lamaran.',
    fields: [
      ['text', 'applicant_name', 'Nama kandidat', true],
      ['email', 'applicant_email', 'Email', true],
      ['tel', 'phone', 'Nomor telepon', true],
      ['select', 'role', 'Posisi', true, ['Frontend Engineer', 'QA Engineer', 'Operations Analyst']],
      ['url', 'portfolio', 'URL portofolio', false],
      ['number', 'experience_years', 'Pengalaman (tahun)', true, null, { min: 0, max: 40 }],
      ['file', 'resume', 'CV atau resume', true, null, { accept: '.pdf,.doc,.docx' }],
      ['textarea', 'cover_note', 'Ringkasan motivasi', true]
    ]
  },
  {
    name: 'Tiket Bantuan',
    description: 'Pelaporan kendala produk kepada tim support.',
    fields: [
      ['email', 'account_email', 'Email akun', true],
      ['select', 'product', 'Produk', true, ['Web App', 'Mobile App', 'API']],
      ['radio', 'priority', 'Prioritas', true, ['Rendah', 'Normal', 'Tinggi']],
      ['text', 'issue_title', 'Judul kendala', true],
      ['textarea', 'issue_details', 'Detail kendala', true],
      ['file', 'attachment', 'Lampiran', false, null, { accept: 'image/*,.pdf,.txt' }]
    ]
  },
  {
    name: 'Survei Kepuasan',
    description: 'Masukan singkat mengenai pengalaman pengguna.',
    fields: [
      ['text', 'respondent_name', 'Nama', false],
      ['email', 'respondent_email', 'Email', false],
      ['radio', 'rating', 'Nilai pengalaman', true, ['1', '2', '3', '4', '5']],
      ['select', 'usage_frequency', 'Frekuensi penggunaan', true, ['Setiap hari', 'Setiap minggu', 'Sesekali']],
      ['textarea', 'feedback', 'Masukan', true],
      ['checkbox', 'follow_up', 'Saya bersedia dihubungi untuk tindak lanjut', false]
    ]
  },
  {
    name: 'Reservasi Meja',
    description: 'Pemesanan meja dengan tanggal dan waktu kunjungan.',
    fields: [
      ['text', 'guest_name', 'Nama tamu', true],
      ['email', 'guest_email', 'Email', true],
      ['tel', 'guest_phone', 'Nomor telepon', true],
      ['date', 'reservation_date', 'Tanggal reservasi', true],
      ['time', 'reservation_time', 'Waktu reservasi', true],
      ['number', 'party_size', 'Jumlah tamu', true, null, { min: 1, max: 20 }],
      ['select', 'occasion', 'Acara', false, ['Makan biasa', 'Ulang tahun', 'Pertemuan bisnis']],
      ['textarea', 'reservation_notes', 'Catatan tambahan', false]
    ]
  },
  {
    name: 'Pemesanan Produk',
    description: 'Data pesanan dan alamat pengiriman dummy.',
    fields: [
      ['text', 'customer_name', 'Nama pelanggan', true],
      ['email', 'customer_email', 'Email', true],
      ['tel', 'customer_phone', 'Nomor telepon', true],
      ['select', 'product_name', 'Produk', true, ['Starter Kit', 'Team Pack', 'Enterprise Box']],
      ['number', 'quantity', 'Jumlah', true, null, { min: 1, max: 99 }],
      ['textarea', 'shipping_address', 'Alamat pengiriman', true],
      ['radio', 'shipping_method', 'Metode pengiriman', true, ['Reguler', 'Ekspres']],
      ['checkbox', 'order_terms', 'Saya menyetujui data pesanan dummy ini', true]
    ]
  },
  {
    name: 'Langganan Newsletter',
    description: 'Preferensi topik dan jadwal newsletter.',
    fields: [
      ['text', 'subscriber_name', 'Nama pelanggan', true],
      ['email', 'subscriber_email', 'Email', true],
      ['checkboxes', 'topics', 'Topik pilihan', false, ['Produk', 'Tutorial', 'Acara', 'Riset']],
      ['select', 'frequency', 'Frekuensi email', true, ['Mingguan', 'Dua mingguan', 'Bulanan']],
      ['checkbox', 'newsletter_consent', 'Saya setuju menerima newsletter', true]
    ]
  },
  {
    name: 'Laporan Insiden',
    description: 'Pencatatan insiden operasional untuk simulasi.',
    fields: [
      ['text', 'reporter_name', 'Nama pelapor', true],
      ['email', 'reporter_email', 'Email pelapor', true],
      ['datetime-local', 'incident_time', 'Waktu insiden', true],
      ['text', 'incident_location', 'Lokasi', true],
      ['select', 'severity', 'Tingkat dampak', true, ['Minor', 'Sedang', 'Serius', 'Kritis']],
      ['number', 'people_affected', 'Jumlah orang terdampak', true, null, { min: 0 }],
      ['textarea', 'incident_description', 'Deskripsi insiden', true],
      ['textarea', 'immediate_action', 'Tindakan awal', false]
    ]
  },
  {
    name: 'Pendaftaran Relawan',
    description: 'Data calon relawan dan preferensi kontribusi.',
    fields: [
      ['text', 'volunteer_name', 'Nama lengkap', true],
      ['email', 'volunteer_email', 'Email', true],
      ['tel', 'volunteer_phone', 'Nomor telepon', true],
      ['date', 'birth_date', 'Tanggal lahir', true],
      ['text', 'city', 'Kota domisili', true],
      ['checkboxes', 'availability', 'Waktu tersedia', false, ['Hari kerja', 'Akhir pekan', 'Malam hari']],
      ['select', 'primary_skill', 'Keahlian utama', true, ['Administrasi', 'Desain', 'Teknis', 'Komunikasi']],
      ['textarea', 'motivation', 'Alasan bergabung', true],
      ['checkbox', 'volunteer_terms', 'Saya menyetujui ketentuan relawan', true]
    ]
  }
];

const app = document.querySelector('#app');
const route = getRoute();

if (route?.invalid) {
  renderInvalidRoute();
} else if (route) {
  renderForm(route.formType, route.duplicate);
} else {
  renderCatalog();
}

function getRoute() {
  const parts = location.pathname.split('/').filter(Boolean);
  const baseIndex = parts.lastIndexOf('dummy-form');
  const formType = Number(parts[baseIndex + 1]);
  const duplicate = Number(parts[baseIndex + 2]);

  if (baseIndex < 0 || parts.length === baseIndex + 1 || parts[baseIndex + 1] === 'index.html') return null;
  if (!Number.isInteger(formType) || !Number.isInteger(duplicate) ||
      formType < 1 || formType > 10 || duplicate < 1 || duplicate > 10) {
    return { invalid: true };
  }

  return { formType, duplicate };
}

function renderCatalog() {
  document.title = '100 Dummy Forms';
  app.innerHTML = `
    ${renderSiteHeader('フォーム一覧')}
    <div class="page-frame">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">ホーム</a><span>フォーム一覧</span></nav>
      <header class="catalog-header page-title">
        <div>
          <p class="hero-english">FORM INDEX</p>
          <h1>フォーム一覧</h1>
        </div>
        <p>10種類のフォームを、それぞれ10ページ用意しています。番号を選択してテストフォームを開いてください。</p>
      </header>
      <section class="catalog-list" aria-label="Daftar jenis form">
        ${FORM_TYPES.map((form, index) => `
          <article class="catalog-row">
            <div class="catalog-copy">
              <span class="form-number">${String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>${form.name}</h2>
                <p>${form.description}</p>
              </div>
            </div>
            <nav class="duplicate-links" aria-label="Duplikasi ${form.name}">
              ${Array.from({ length: 10 }, (_, duplicate) =>
                `<a href="${index + 1}/${duplicate + 1}/" aria-label="${form.name} duplikasi ${duplicate + 1}">${duplicate + 1}</a>`
              ).join('')}
            </nav>
          </article>
        `).join('')}
      </section>
    </div>
    ${renderSiteFooter()}
  `;
}

function renderForm(formType, duplicate) {
  const config = FORM_TYPES[formType - 1];
  document.title = `${config.name} ${formType}/${duplicate}`;
  app.innerHTML = `
    ${renderSiteHeader('お問い合わせ')}
    <div class="page-frame">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">ホーム</a><a href="/dummy-form/">フォーム一覧</a><span>お問い合わせ</span></nav>
      <header class="form-intro">
        <div class="page-title-heading">
          <p class="hero-english">CONTACT</p>
          <h1>お問い合わせフォーム</h1>
        </div>
        <div class="form-summary">
          <p class="kicker">FORM ${String(formType).padStart(2, '0')} / COPY ${String(duplicate).padStart(2, '0')}</p>
          <h2>${config.name}</h2>
          <p>${config.description}</p>
        </div>
        <dl class="route-meta">
          <div><dt>フォーム種別</dt><dd>${formType}</dd></div>
          <div><dt>複製番号</dt><dd>${duplicate}</dd></div>
          <div><dt>URL</dt><dd>/dummy-form/${formType}/${duplicate}</dd></div>
        </dl>
      </header>
      <section class="form-panel" aria-labelledby="form-heading">
        <div class="form-heading-block">
          <h2 id="form-heading">必要事項をご入力ください</h2>
          <p>「必須」の項目は必ず入力してください。入力内容はテスト用途にのみ使用されます。</p>
        </div>
        <form id="dummy-form" data-form-type="${formType}" data-duplicate="${duplicate}">
          <input type="hidden" name="form_type" value="${formType}">
          <input type="hidden" name="duplicate" value="${duplicate}">
          <div class="field-grid">
            ${config.fields.map(renderField).join('')}
          </div>
          <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
          <button class="submit-button" type="submit">テスト送信する</button>
        </form>
        <section id="success-panel" class="success-panel" hidden>
          <p class="hero-english">COMPLETE</p>
          <h2>テスト送信が完了しました</h2>
          <p>Data berhasil dikirim ke spreadsheet.</p>
          <pre id="result-json"></pre>
          <button id="reset-button" class="secondary-button" type="button">もう一度入力する</button>
        </section>
      </section>
    </div>
    ${renderSiteFooter()}
  `;

  const form = document.querySelector('#dummy-form');
  form.addEventListener('submit', handleSubmit);
  document.querySelector('#reset-button').addEventListener('click', () => {
    document.querySelector('#success-panel').hidden = true;
    form.hidden = false;
    form.reset();
    form.querySelector('input:not([type="hidden"])')?.focus();
  });
}

function renderField([type, name, label, required, options, attributes = {}]) {
  const requiredMark = required ? '<span class="required-badge">必須</span>' : '';
  const requiredAttr = required ? ' required' : '';
  const attrs = Object.entries(attributes).map(([key, value]) => ` ${key}="${value}"`).join('');

  if (type === 'textarea') {
    return `<label class="field"><span class="field-label">${label}${requiredMark}</span><textarea name="${name}" rows="5"${requiredAttr}></textarea></label>`;
  }

  if (type === 'select') {
    return `<label class="field"><span class="field-label">${label}${requiredMark}</span><select name="${name}"${requiredAttr}><option value="">選択してください</option>${options.map(option => `<option value="${option}">${option}</option>`).join('')}</select></label>`;
  }

  if (type === 'radio' || type === 'checkboxes') {
    const inputType = type === 'radio' ? 'radio' : 'checkbox';
    return `<fieldset class="field option-field"><legend class="field-label">${label}${requiredMark}</legend><div class="option-list">${options.map((option, index) => `<label><input type="${inputType}" name="${name}" value="${option}"${required && index === 0 ? ' required' : ''}> <span>${option}</span></label>`).join('')}</div></fieldset>`;
  }

  if (type === 'checkbox') {
    return `<label class="field checkbox-field"><span class="field-label">確認${requiredMark}</span><span class="checkbox-option"><input type="checkbox" name="${name}" value="yes"${requiredAttr}> <span>${label}</span></span></label>`;
  }

  return `<label class="field"><span class="field-label">${label}${requiredMark}</span><input type="${type}" name="${name}"${requiredAttr}${attrs}></label>`;
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#form-status');

  if (!form.checkValidity()) {
    status.textContent = 'Periksa kembali kolom yang wajib diisi.';
    form.reportValidity();
    return;
  }

  button.disabled = true;
  button.textContent = 'Memproses...';
  status.textContent = '';

  const formType = Number(form.dataset.formType);
  const duplicate = Number(form.dataset.duplicate);
  const fields = serializeForm(form);
  const sourceUrl = `${location.origin}${location.pathname}`;

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sourceUrl,
        sourcePath: location.pathname,
        formType,
        duplicate,
        formName: FORM_TYPES[formType - 1].name,
        fields
      })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    document.querySelector('#result-json').textContent = JSON.stringify({
      source_url: sourceUrl,
      form_type: formType,
      duplicate,
      fields
    }, null, 2);
    form.hidden = true;
    document.querySelector('#success-panel').hidden = false;
  } catch (error) {
    status.textContent = `Gagal mengirim ke spreadsheet: ${error.message}. Jalankan melalui Vercel, bukan python http.server.`;
  } finally {
    button.disabled = false;
    button.textContent = 'テスト送信する';
  }
}

function renderSiteHeader(activeLabel) {
  return `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="site-brand" href="/dummy-form/">
          <span class="brand-ja">フォームテスト株式会社</span>
          <span class="brand-en">FORM TEST LAB</span>
        </a>
        <nav class="site-nav" aria-label="Main navigation">
          <a href="/">ホーム</a>
          <a href="/dummy-form/"${activeLabel === 'フォーム一覧' ? ' aria-current="page"' : ''}>フォーム一覧</a>
          <span${activeLabel === 'お問い合わせ' ? ' aria-current="page"' : ''}>お問い合わせ</span>
        </nav>
      </div>
    </header>
  `;
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <div><strong>フォームテスト株式会社</strong><span>WebRPA test fixtures</span></div>
      <p>© Dummy Form Collection</p>
    </footer>
  `;
}

function serializeForm(form) {
  const result = {};
  for (const [key, value] of new FormData(form)) {
    const normalized = value instanceof File
      ? { name: value.name, size: value.size, type: value.type }
      : value;

    if (key in result) {
      result[key] = Array.isArray(result[key]) ? [...result[key], normalized] : [result[key], normalized];
    } else {
      result[key] = normalized;
    }
  }
  return result;
}

function renderInvalidRoute() {
  document.title = 'Dummy form tidak ditemukan';
  app.innerHTML = `
    ${renderSiteHeader('お問い合わせ')}
    <div class="page-frame">
      <section class="invalid-route">
        <p class="hero-english">NOT FOUND</p>
        <h1>フォームが見つかりません</h1>
        <p>Jenis form dan nomor duplikasi harus menggunakan angka 1 sampai 10.</p>
        <a class="submit-button" href="/dummy-form/">フォーム一覧へ戻る</a>
      </section>
    </div>
    ${renderSiteFooter()}
  `;
}
