const REDIRECT_TARGETS = ['receipt', 'download', 'billing', 'invoice'];
const MAX_DELAY_SECONDS = 60;
const CORRECT_PIN = '1234';

// href root-relative untuk endpoint serverless; hanya jalan di server, bukan file://
const FILE_TARGETS = {
  html: { href: 'invoice-fake.pdf', download: 'invoice-fake.pdf' },
  empty: { href: 'invoice-empty.pdf', download: 'invoice-empty.pdf' },
  expired: { href: 'invoice-expired.pdf', download: 'invoice-expired.pdf' },
  json: { href: '/api/invoice-json', download: 'invoice-error.json' },
  error500: { href: '/api/invoice-error', download: 'invoice-error.pdf' },
};

const PARAM_DOCS = [
  { param: '?delay=N', desc: 'Tombol disembunyikan, countdown N detik, lalu download otomatis. N dibatasi 1–60.' },
  { param: '?redirect=X', desc: 'Saat tombol diklik, PDF tetap terunduh lalu halaman redirect ke /dummy-inv/X/. X salah satu dari receipt, download, billing, invoice.' },
  { param: '?cookie_banner=1', desc: 'Banner cookie menutupi area tombol. RPA harus klik #cookie-accept sebelum bisa download.' },
  { param: '?pin_gate=1', desc: 'Gerbang PIN mengunci tombol. PIN benar: 1234. PIN salah menampilkan #pin-error dan tombol tetap terkunci.' },
  { param: '?selector=v2', desc: 'Tombol memakai selector alternatif #dl-invoice-v2 dan kelas .pdf-download-alt, bukan #download-invoice.' },
  { param: '?file=html', desc: 'Download menghasilkan file berekstensi .pdf tetapi berisi HTML, bukan PDF valid.' },
  { param: '?file=empty', desc: 'Download menghasilkan file 0 byte.' },
  { param: '?file=expired', desc: 'Download menghasilkan PDF invoice berstatus kedaluwarsa.' },
  { param: '?file=json', desc: 'Tombol menunjuk /api/invoice-json, yang mengembalikan body JSON, bukan file PDF. Butuh server.' },
  { param: '?file=error500', desc: 'Tombol menunjuk /api/invoice-error, yang mengembalikan HTTP 500. Butuh server.' },
  { param: 'kombinasi', desc: 'Semua param dapat digabung, misal ?pin_gate=1&delay=5 (countdown baru jalan setelah PIN benar) atau ?selector=v2&file=expired.' },
];

function isValidDelay(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function clampDelay(n) {
  return Math.min(n, MAX_DELAY_SECONDS);
}

function isValidRedirect(name) {
  return REDIRECT_TARGETS.includes(name);
}

function isValidFile(value) {
  return Object.prototype.hasOwnProperty.call(FILE_TARGETS, value);
}

function parseParams(search) {
  const params = new URLSearchParams(search);
  const rawDelay = params.get('delay');
  const delay = isValidDelay(rawDelay) ? clampDelay(Number(rawDelay)) : 0;
  const redirect = params.get('redirect');
  const file = params.get('file');
  return {
    delay,
    redirect: isValidRedirect(redirect) ? redirect : null,
    file: isValidFile(file) ? file : null,
    selectorV2: params.get('selector') === 'v2',
    cookieBanner: params.get('cookie_banner') === '1',
    pinGate: params.get('pin_gate') === '1',
  };
}

function resolveRedirectUrl(hubBase, name) {
  if (!isValidRedirect(name)) return null;
  return new URL(name + '/', new URL(hubBase, window.location.href)).href;
}

// File lokal di-resolve relatif terhadap hub; endpoint /api/ dipakai apa adanya.
function resolveFileHref(hubBase, file) {
  if (!isValidFile(file)) return null;
  const target = FILE_TARGETS[file].href;
  if (target.startsWith('/')) return target;
  return new URL(target, new URL(hubBase, window.location.href)).href;
}

function applyFileVariant(anchor, hubBase, file) {
  if (!isValidFile(file)) return;
  anchor.href = resolveFileHref(hubBase, file);
  anchor.setAttribute('download', FILE_TARGETS[file].download);
}

function applySelectorV2(anchor) {
  anchor.id = 'dl-invoice-v2';
  anchor.className = 'pdf-download-alt';
}

function formatCountdown(seconds) {
  return seconds === 1
    ? 'Downloading in 1 second…'
    : 'Downloading in ' + seconds + ' seconds…';
}

function startCountdown(anchor, status, seconds, onDone) {
  let remaining = seconds;
  status.hidden = false;
  status.textContent = formatCountdown(remaining);
  const timer = setInterval(function () {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      status.textContent = 'Downloading…';
      anchor.click();
      if (onDone) onDone();
      return;
    }
    status.textContent = formatCountdown(remaining);
  }, 1000);
  return timer;
}

// Satu sumber definisi untuk panel dokumen di semua halaman.
function renderParamDocs() {
  const list = document.getElementById('param-docs-list');
  const note = document.getElementById('param-docs-note');
  if (!list) return;
  const frag = document.createDocumentFragment();
  PARAM_DOCS.forEach(function (item) {
    const dt = document.createElement('dt');
    const code = document.createElement('code');
    code.textContent = item.param;
    dt.appendChild(code);
    const dd = document.createElement('dd');
    dd.textContent = item.desc;
    frag.appendChild(dt);
    frag.appendChild(dd);
  });
  list.appendChild(frag);
  if (note) {
    note.textContent =
      'Dua varian butuh server (npx vercel dev atau deployment): ?file=json dan ?file=error500. ' +
      'Halaman lain tetap jalan di python3 -m http.server maupun file://.';
  }
}

function setupCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  if (!banner || !accept) return;
  banner.hidden = false;
  accept.addEventListener('click', function () {
    banner.hidden = true;
  });
}

// Mengunci tombol sampai PIN benar dimasukkan.
function setupPinGate(anchor, onUnlock) {
  const gate = document.getElementById('pin-gate');
  const input = document.getElementById('pin-input');
  const submit = document.getElementById('pin-submit');
  const error = document.getElementById('pin-error');
  if (!gate || !input || !submit || !error) return;
  gate.hidden = false;
  anchor.hidden = true;

  submit.addEventListener('click', function () {
    if (input.value === CORRECT_PIN) {
      gate.hidden = true;
      error.hidden = true;
      onUnlock();
    } else {
      error.hidden = false;
    }
  });
}

function init() {
  renderParamDocs();

  const anchor = document.getElementById('download-invoice');
  const status = document.getElementById('download-status');
  if (!anchor || !status) return;

  const variant = parseParams(window.location.search);
  const hubBase = document.body.getAttribute('data-hub') || './';

  if (variant.selectorV2) applySelectorV2(anchor);
  if (variant.file) applyFileVariant(anchor, hubBase, variant.file);
  if (variant.cookieBanner) setupCookieBanner();

  if (variant.redirect) {
    anchor.addEventListener('click', function () {
      const target = resolveRedirectUrl(hubBase, variant.redirect);
      if (target) setTimeout(function () { window.location.assign(target); }, 0);
    });
  }

  const startDelay = function () {
    if (variant.delay > 0) {
      anchor.hidden = true;
      startCountdown(anchor, status, variant.delay, function () {
        anchor.hidden = false;
      });
    }
  };

  if (variant.pinGate) {
    // PIN dulu; countdown baru jalan setelah unlock.
    setupPinGate(anchor, startDelay);
  } else {
    startDelay();
  }
}

if (typeof document !== 'undefined') init();

export {
  parseParams,
  resolveRedirectUrl,
  resolveFileHref,
  formatCountdown,
  isValidRedirect,
  isValidFile,
  CORRECT_PIN,
  FILE_TARGETS,
  PARAM_DOCS,
};
